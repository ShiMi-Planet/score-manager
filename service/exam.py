from flask import Blueprint, request, jsonify
from flask_login import login_required
from config import *
from setting import *

exam = Blueprint('exam', __name__)


@exam.route("/detail", methods=["POST"])
@login_required
def exam_detail():
    res = {"code": 0, "message": ""}
    id = request.form.get("id")
    conn, c = connect()
    count = c.execute('''SELECT count(*) FROM test_list WHERE id = ?''', (id,)).fetchone()[0]
    if count == 0:
        conn.close()
        res["code"] = 404
        res["message"] = "为查找到本次测试"
        return jsonify(res)
    else:
        slist = c.execute('''SELECT subject,subject_name,full_score FROM subject WHERE state=1''').fetchall()
        detail = []
        for i in slist:
            score = c.execute(f"SELECT {i[0]} FROM test_list WHERE id={id}").fetchone()[0]
            detail.append(
                {
                    "subject": i[0],
                    "subject_name": i[1],
                    "score": score,
                    "full_score": i[2],
                }
            )
        conn.close()
        res["code"] = 200
        res["message"] = "success"
        res["detail"] = detail
        return jsonify(res)


@exam.route("/list", methods=["GET"])
@login_required
def exam_list():
    res = {"code": 0, "message": ""}
    page = int(request.args.get("page"))
    if page <= 0:
        page = 1
    start = (page - 1) * 10
    print(start)
    data = []
    conn, c = connect()
    row = c.execute('''SELECT id,name,date FROM test_list ORDER BY date DESC LIMIT 10 OFFSET ?''', (start,)).fetchall()
    print(row)
    for k in row:
        lid = k[0]
        name = k[1]
        date = k[2]
        subject = c.execute('''SELECT subject,full_score FROM subject WHERE state=1''').fetchall()
        strl = ""
        full = 0
        for i in subject:
            strl += "+" + i[0]
            full += i[1]
        strl = strl[1:]
        score = c.execute(f"SELECT {strl} FROM test_list WHERE id=?", (lid,)).fetchone()[0]
        data.append({
            "id": lid,
            "name": name,
            "date": date,
            "score": score,
            "full_score": full,
        })
    conn.close()
    res["code"] = 200
    res["message"] = "success"
    res["data"] = data
    return jsonify(res)


@exam.route('/add/record', methods=['POST'])
@login_required
def add_record():
    res = {"code": 0, "message": ""}
    name = request.form.get("name")
    class_array = request.form.get("class")
    grade_array = request.form.get("grade")
    score = request.form.get("score")
    if not score or score == "" or not name or name == "":
        res["code"] = 300
        res["message"] = "请完善信息后再次提交"
        return jsonify(res)
    else:
        subject_list = []
        value_list = []
        score = score.split(";")
        score.pop()
        value_state=False
        for i in score:
            m = i.split(",")
            if m[1] != "":
                value_state = True
        if not value_state:
            res["code"] = 300
            res["message"] = "请完善信息后再次提交"
            return jsonify(res)
        else:
            for i in score:
                m = i.split(",")
                if m[1] == "":
                    continue
                else:
                    subject_list.append(m[0])
                    value_list.append(int(m[1]))
            conn, c = connect()
            verify = c.execute('''SELECT COUNT(*) FROM test_list WHERE name=?''',(name,)).fetchone()[0]
            if verify == 0:
                c.execute('''INSERT INTO test_list (name,grade,class) VALUES (?,?,?)''', (name, grade_array, class_array))
                conn.commit()
                for i in range(len(subject_list)):
                    c.execute(f"UPDATE test_list SET {subject_list[i]}={value_list[i]} WHERE name='{name}'")
                    conn.commit()
                conn.close()
                res["code"] = 200
                res["message"] = "success"
                return jsonify(res)
            else:
                conn.close()
                res["code"] = 500
                res["message"] = "该测试名称已存在！"
                return jsonify(res)