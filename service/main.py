import datetime
from flask import Flask, jsonify, request, session, make_response, render_template
from flask_cors import *
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user, login_required, UserMixin
from datetime import datetime

from config import *
from setting import *

from subject import subject
from exam import exam
from corbook import corb

app = Flask(__name__)
CORS(app, supports_credentials=True)
cross_origin(
    origins="*",
    allow_headers="*",
    methods="*",
)

app.register_blueprint(subject, url_prefix='/subject')
app.register_blueprint(exam, url_prefix='/exam')
app.register_blueprint(corb, url_prefix='/corbook')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login-manager.db'
app.config['SECRET_KEY'] = 'sHImiPlanet-ScoremaNAGer@DAtABasE'
app.config['REMEMBER_COOKIE_DURATION'] = 24 * 60 * 60
app.config['SESSION_TYPE'] = 'filesystem'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return f'<User {self.username}>'

    def verify_password(self, password):
        return decrypt(password, self.password)


@login_manager.user_loader
def load_user(user_id):
    user = db.session.get(User, user_id)
    return user


@app.route("/", methods=['GET'])
def route_test():
    print(load_user(current_user.id))
    res = {"code": 0, "message": ""}
    res['code'] = 200
    res['message'] = "OK"
    return jsonify(res)


@app.route('/user/register', methods=['POST'])
def register():
    res = {"code": 0, "message": ""}
    username = request.form.get("username")
    password = request.form.get("password")
    if not username or not password or username == "" or password == "":
        res['message'] = "请输入合法用户名及密码"
        res["code"] = 401
        return jsonify(res)
    else:
        if User.query.filter_by(username=username).first():
            res["code"] = 300
            res["message"] = "用户名已存在"
            return jsonify(res)
        else:
            user = User(username=username, password=encrypt(password))
            db.session.add(user)
            db.session.commit()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)


@app.route("/user/login", methods=['POST'])
def login():
    res = {"code": 0, "message": ""}
    username = request.form.get("username")
    password = request.form.get("password")
    remember = request.form.get("remember")
    if username == "" or password == "" or not username or not password:
        res['message'] = "请输入用户名及密码"
        res["code"] = 401
        return jsonify(res)
    else:
        user = User.query.filter_by(username=username).first()
        if user and decrypt(password, user.password):
            if remember == 1:
                login_user(user=user, remember=True, duration=datetime.timedelta(days=30))
            else:
                login_user(user=user, remember=False)
            res["code"] = 200
            res["message"] = "success"
            res["login"] = True
            return jsonify(res)
        else:
            res["code"] = 401
            res["message"] = "用户名或密码错误"
            res["login"] = False
            return jsonify(res)


@app.route("/user/state", methods=['GET'])
def state_test():
    res = {"code": 0, "message": ""}
    if current_user.is_authenticated:
        res["state"] = True
    else:
        res["state"] = False
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)


@app.route("/user/getname", methods=['GET'])
@login_required
def getname():
    res = {"code": 0, "message": ""}
    res["code"] = 200
    res["message"] = "success"
    res["username"] = current_user.username
    return jsonify(res)


@app.route("/user/logout", methods=['GET'])
@login_required
def logout():
    res = {"code": 0, "message": ""}
    session.pop("username", None)
    session.pop("password", None)
    session.pop("user_id", None)
    resp = make_response()
    resp.set_cookie("session", "", expires=0)
    logout_user()
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)


@app.route("/user/change_password", methods=['POST'])
@login_required
def change_password():
    res = {"code": 0, "message": ""}
    old_password = request.form.get("old_password")
    new_password = request.form.get("new_password")
    if not old_password or not new_password or old_password == "" or new_password == "":
        res["code"] = 401
        res["message"] = "信息输入不完整！"
        return jsonify(res)
    else:
        if old_password == new_password:
            res["code"] = 401
            res["message"] = "新密码与旧密码相同！"
            return jsonify(res)
        elif not current_user.verify_password(old_password):
            res["code"] = 300
            res["message"] = "旧密码有误，请检查后再次尝试！"
            return jsonify(res)
        else:
            current_user.password = encrypt(new_password)
            db.session.commit()
            session.pop("username", None)
            session.pop("password", None)
            session.pop("user_id", None)
            resp = make_response()
            resp.set_cookie("session", "", expires=0)
            logout_user()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)


@app.route("/info", methods=["GET"])
@login_required
def basic_info():
    res = {"code": 0, "message": ""}
    conn, c = connect()
    # top bar
    subject_count = c.execute('''SELECT count(*) FROM subject WHERE state=1''').fetchone()[0]
    test_count = c.execute('''SELECT count(*) FROM test_list''').fetchone()[0]
    cor_count = c.execute('''SELECT count(*) FROM correct_book''').fetchone()[0]
    res["subject"] = subject_count
    res["test"] = test_count
    res["correct"] = cor_count
    # score
    s_list = c.execute('''SELECT subject,subject_name,color FROM subject WHERE state=1''').fetchall()
    test_ = []
    score = {}
    check = []
    d_list = []
    color = {}
    d = c.execute('''SELECT date FROM test_list ORDER BY date DESC LIMIT 5''').fetchall()
    for date in d:
        d_list.append(str(date[0]).split(" ")[0])
    for i in s_list:
        scode = i[0]
        sn = i[1]
        check.append({
            "code": scode,
            "name": sn,
        })
        color[i[0] + "_color"] = i[2]
        test_.append(scode)
    for i in test_:
        temp = c.execute(f"SELECT {i} FROM test_list ORDER BY date DESC LIMIT 5").fetchall()
        score[i] = []
        for j in temp:
            score[i].append(j[0])
    conn.close()
    res["color"] = color
    res["score"] = score
    res["test_date"] = d_list
    res["subject_check"] = check
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    preload()
    app.run(host='0.0.0.0', port=service_port, debug=False)
