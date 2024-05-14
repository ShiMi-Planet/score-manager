from flask import Blueprint, request, jsonify
from flask_login import login_required
from config import *
from setting import *

corb = Blueprint('corbook', __name__)


@corb.route("/add", methods=['POST'])
@login_required
def add_record():
    res = {"code": 0, "message": ""}
    subject = request.form.get("subject")
    question = request.form.get("question")
    answer = request.form.get("answer")
    test = request.form.get("test_id")
    lose_ana = request.form.get("lose_analyze")
    if not subject or subject == "" or not question or question == "" or not answer or answer == "":
        res["code"] = 300
        res["message"] = "信息不完整！"
        return jsonify(res)
    else:
        conn, c = connect()
        valid = c.execute('''SELECT COUNT(*) FROM correct_book WHERE question=?''', (question,)).fetchone()[0]
        if valid == 1:
            res["code"] = 300
            res["message"] = "已存在相同记录！"
            return jsonify(res)
        else:
            count = 1
            if test != "":
                count = c.execute('''SELECT COUNT(*) FROM test_list where id=?''', (test,)).fetchone()[0]
            s_state = c.execute(f"SELECT COUNT(*) FROM subject WHERE subject='{subject}' AND state=1").fetchone()[0]
            if test != "":
                if count == 0 or s_state == 0:
                    conn.close()
                    res["code"] = 300
                    res["message"] = "未查找到相关测试或相关学科未开放!"
                    return jsonify(res)
                else:
                    c.execute(
                        '''INSERT INTO correct_book (subject,question,answer,test,lose_analyze) VALUES (?,?,?,?,?)''',
                        (subject, question, answer, test, lose_ana))
                    conn.commit()
                    conn.close()
                    res["code"] = 200
                    res["message"] = "success"
                    return jsonify(res)
            else:
                if s_state == 0:
                    conn.close()
                    res["code"] = 300
                    res["message"] = "未查找到相关测试或相关学科未开放!"
                    return jsonify(res)
                else:
                    c.execute(
                        '''INSERT INTO correct_book (subject,question,answer,test,lose_analyze) VALUES (?,?,?,?,?)''',
                        (subject, question, answer, test, lose_ana))
                    conn.commit()
                    conn.close()
                    res["code"] = 200
                    res["message"] = "success"
                    return jsonify(res)


@corb.route("/delete", methods=["POST"])
@login_required
def delete():
    res = {"code": 0, "message": ""}
    id = request.form.get("id")
    if not id or id == "":
        res["code"] = 400
        res["message"] = "信息不完整！"
        return jsonify(res)
    else:
        conn, c = connect()
        count = c.execute('''SELECT COUNT(*) FROM correct_book WHERE id=?''', (id,)).fetchone()[0]
        if count == 0:
            conn.close()
            res["code"] = 400
            res["message"] = "未查找到相关记录！"
            return jsonify(res)
        else:
            c.execute('''DELETE FROM correct_book WHERE id=?''', (id,))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)


@corb.route("/list", methods=['GET'])
@login_required
def list_all():
    res = {"code": 0, "message": ""}
    conn, c = connect()
    l = c.execute('''SELECT date,subject,question,test,id FROM correct_book ORDER BY date DESC''').fetchall()
    date = []
    for i in l:
        sname = c.execute('''SELECT subject_name FROM subject WHERE subject=?''', (i[1],)).fetchone()[0]
        if i[3] == "" or not i[3]:
            test_name = ""
        else:
            test_name = c.execute('''SELECT name FROM test_list WHERE id=?''', (i[3],)).fetchone()[0]
        date.append({
            "date": i[0],
            # "subject": i[1],
            "subject_name": sname,
            "question": str(i[2]).split(">")[1].split("<")[0] + str("..."),
            "test": test_name,
            "id": i[4],
        })
    conn.close()
    res["code"] = 200
    res["message"] = "success"
    res["data"] = date
    return jsonify(res)


@corb.route("/detail/<int:id>", methods=["GET"])
@login_required
def detail(id):
    res = {"code": 0, "message": ""}
    if not id or id == "":
        res["code"] = 300
        res["message"] = "信息不完整！"
        return jsonify(res)
    else:
        conn, c = connect()
        count = c.execute('''SELECT COUNT(*) FROM correct_book WHERE id=?''', (id,)).fetchone()[0]
        if count == 0:
            conn.close()
            res["code"] = 400
            res["message"] = "未查找到相应记录！"
            return jsonify(res)
        else:
            l = c.execute('''SELECT subject,question,answer,test,lose_analyze FROM correct_book WHERE id=?''',
                          (id,)).fetchall()
            conn.close()
            data = []
            for i in l:
                data.append({
                    "subject": i[0],
                    "question": i[1],
                    "answer": i[2],
                    "test": i[3],
                    "lose_analyze": i[4],
                })
            res["code"] = 200
            res["message"] = "success"
            res["data"] = data
            return jsonify(res)


@corb.route("/detail/<int:id>", methods=['POST'])
@login_required
def update_record(id):
    res = {"code": 0, "message": ""}
    question = request.form.get("question")
    answer = request.form.get("answer")
    test = request.form.get("test_id")
    lose_ana = request.form.get("lose_analyze")
    print(f"Question: {question}")
    print(f"Answer: {answer}")
    print(f"Test: {test}")
    print(f"Lose_analyze: {lose_ana}")
    print(f"ID: {id}")
    if not question or question == "" or not answer or answer == "":
        res["code"] = 300
        res["message"] = "信息不完整！"
        return jsonify(res)
    else:
        conn, c = connect()
        valid = c.execute('''SELECT COUNT(*) FROM correct_book WHERE id=?''', (id,)).fetchone()[0]
        if valid == 0:
            res["code"] = 300
            res["message"] = "记录不存在！"
            return jsonify(res)
        else:
            count = 1
            if test != "":
                count = c.execute('''SELECT COUNT(*) FROM test_list where id=?''', (test,)).fetchone()[0]
            if test != "":
                if count == 0:
                    conn.close()
                    res["code"] = 300
                    res["message"] = "未查找到相关测试!"
                    return jsonify(res)
                else:
                    c.execute(
                        '''UPDATE correct_book SET question=?,answer=?,test=?,lose_analyze=? WHERE id=?''',
                        (question, answer, test, lose_ana, id))
                    conn.commit()
                    conn.close()
                    res["code"] = 200
                    res["message"] = "success"
                    return jsonify(res)
            else:
                c.execute(
                    '''UPDATE correct_book SET question=?,answer=?,test="",lose_analyze=? WHERE id=?''',
                    (question, answer, lose_ana, id))
                conn.commit()
                conn.close()
                res["code"] = 200
                res["message"] = "success"
                return jsonify(res)
