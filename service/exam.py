import math
from flask import Blueprint, request, jsonify
from flask_login import login_required
from config import *
from setting import *
from spark import genReport
import markdown

exam = Blueprint('exam', __name__)


@exam.route("/detail", methods=["POST"])
@login_required
def exam_detail():
    res = {"code": 0, "message": ""}
    id = request.form.get("id")
    conn, c = connect()
    count = c.execute('''SELECT count(*) FROM test_list WHERE id=?''', (id,)).fetchone()[0]
    if count == 0:
        conn.close()
        res["code"] = 404
        res["message"] = "未查找到本次测试"
        return jsonify(res)
    else:
        name = c.execute('''SELECT name FROM test_list WHERE id=?''', (id,)).fetchone()[0]
        report = c.execute('''SELECT report FROM test_list WHERE id=?''', (id,)).fetchone()[0]
        report = markdown.markdown(report)
        slist = c.execute('''SELECT subject,subject_name,full_score,color FROM subject WHERE state=1''').fetchall()
        detail = []
        for i in slist:
            score = c.execute(f"SELECT {i[0]} FROM test_list WHERE id={id}").fetchone()[0]
            detail.append(
                {
                    "subject": i[0],
                    "subject_name": i[1],
                    "score": score,
                    "full_score": i[2],
                    "color": i[3],
                }
            )
        conn.close()
        res["code"] = 200
        res["message"] = "success"
        res["detail"] = detail
        res["name"] = name
        res["id"] = id
        res["report"] = report
        return jsonify(res)


@exam.route("/get/page", methods=["GET"])
def get_pages():
    res = {"code": 0, "message": ""}
    conn, c = connect()
    pages = c.execute('''SELECT COUNT(*) FROM test_list''').fetchone()[0] / 10
    conn.close()
    res["code"] = 200
    res["message"] = "success"
    res["pages"] = math.ceil(pages)
    return jsonify(res)


@exam.route("/list", methods=["GET"])
@login_required
def exam_list():
    res = {"code": 0, "message": ""}
    page = int(request.args.get("page"))
    if page <= 0:
        page = 1
    start = (page - 1) * 10
    data = []
    conn, c = connect()
    row = c.execute('''SELECT id,name,date,class,grade FROM test_list ORDER BY date DESC LIMIT 10 OFFSET ?''',
                    (start,)).fetchall()
    for k in row:
        lid = k[0]
        name = k[1]
        date = str(k[2]).split(" ")[0]
        class_array = k[3]
        grade_array = k[4]
        subject = c.execute('''SELECT subject,full_score FROM subject WHERE state=1''').fetchall()
        strl = ""
        full = 0
        for i in subject:
            strl += "+" + "COALESCE({}, 0)".format(i[0])
            full += i[1]
        strl = strl[1:]
        score = c.execute(f"SELECT {strl} FROM test_list WHERE id={lid}").fetchone()[0]
        data.append({
            "id": lid,
            "name": name,
            "date": date,
            "score": score,
            "full_score": full,
            "class": class_array,
            "grade": grade_array,
        })
    conn.close()
    res["code"] = 200
    res["message"] = "success"
    res["data"] = data
    return jsonify(res)


@exam.route("/list/all", methods=['GET'])
@login_required
def list_all():
    res = {"code": 0, "message": ""}
    data = []
    conn, c = connect()
    row = c.execute('''SELECT id,name,date,class,grade FROM test_list ORDER BY date DESC''').fetchall()
    for i in row:
        lid = i[0]
        lname = i[1]
        ldate = str(i[2]).split(" ")[0]
        class_array = i[3]
        grade_array = i[4]
        subject = c.execute('''SELECT subject,full_score FROM subject WHERE state=1''').fetchall()
        strl = ""
        full = 0
        for i in subject:
            strl += "+" + "COALESCE({}, 0)".format(i[0])
            full += i[1]
        strl = strl[1:]
        score = c.execute(f"SELECT {strl} FROM test_list WHERE id={lid}").fetchone()[0]
        data.append({
            "id": lid,
            "name": lname,
            "date": ldate,
            "score": score,
            "full_score": full,
            "class": class_array,
            "grade": grade_array,
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
        value_state = False
        for i in score:
            m = i.split(",")
            if m[1] != "":
                value_state = True
        if not value_state:
            res["code"] = 300
            res["message"] = "请完善信息后再次提交"
            return jsonify(res)
        else:
            conn, c = connect()
            for i in score:
                m = i.split(",")
                if m[1] == "":
                    continue
                else:
                    maxs = c.execute('''SELECT full_score FROM subject WHERE subject=?''', (m[0],)).fetchone()[0]
                    if float(m[1]) > float(maxs) or float(m[1]) < 0.0:
                        conn.close()
                        res["code"] = 300
                        res["message"] = "分数超过最大限度！"
                        return jsonify(res)
                    else:
                        subject_list.append(m[0])
                        value_list.append(float(m[1]))
            verify = c.execute('''SELECT COUNT(*) FROM test_list WHERE name=?''', (name,)).fetchone()[0]
            if verify == 0:
                c.execute('''INSERT INTO test_list (name,grade,class) VALUES (?,?,?)''',
                          (name, grade_array, class_array))
                conn.commit()
                sparkStr = ""
                for i in range(len(subject_list)):
                    c.execute(f"UPDATE test_list SET {subject_list[i]}={value_list[i]} WHERE name='{name}'")
                    conn.commit()
                    subName = \
                        c.execute('''SELECT subject_name FROM subject WHERE subject=?''',
                                  (subject_list[i],)).fetchone()[0]
                    FullMark = \
                        c.execute('''SELECT full_score FROM subject WHERE subject=?''', (subject_list[i],)).fetchone()[
                            0]
                    sparkStr += f'我的{subName}成绩为{value_list[i]}分，这个科目的满分为{FullMark};'
                report = genReport(sparkStr)[1]['content']
                # report = "分析功能调试中：" + sparkStr
                c.execute('''UPDATE test_list SET report=? WHERE name=?''', (report, name))
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


@exam.route("/delete/<int:id>", methods=['POST'])
@login_required
def delete_record(id):
    res = {"code": 0, "message": ""}
    if not id or id == "":
        res["code"] = 300
        res["message"] = "请输入有效信息！"
        return jsonify(res)
    else:
        conn, c = connect()
        count = c.execute('''SELECT COUNT(*) FROM test_list WHERE id=?''', (id,)).fetchone()[0]
        if int(count) == 0:
            conn.close()
            res["code"] = 300
            res["message"] = "未查询到相关记录"
            return jsonify(res)
        else:
            c.execute('''DELETE FROM test_list WHERE id=?''', (id,))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)


@exam.route("/update/<int:id>/<int:type>/<int:value1>", methods=['POST'])
@login_required
def update_single_record(id, type, value1):
    '''
    This method is for updating the existing exam record's ranking.
    Args:
        id (int): The id of the exam
        type <int>:  1 refers to "class ranking"
                     2 refers to "grade ranking"
                     3 refers to "class and grade ranking", and the second value refers to grade ranking
        value1 <int>:  The value of the selected ranking

    Returns:
        Successfully changed record with code 200 and "success" message returned. Otherwise, error message is returned with corresponding code.
    '''
    res = {"code": 0, "message": ""}
    if not type or type == "" or not id or id == "" or not value1 or value1 == "":
        res["code"] = 300
        res["message"] = "请输入有效信息！"
        return jsonify(res)
    else:
        conn, c = connect()
        if type == 1:
            c.execute('''UPDATE test_list SET class=? WHERE id=?''', (value1, id))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)
        elif type == 2:
            c.execute('''UPDATE test_list SET grade=? WHERE id=?''', (value1, id))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)
        else:
            conn.close()
            res["code"] = 400
            res["message"] = "更改类型不可用！"
            return jsonify(res)


@exam.route("/update/<int:id>/<int:type>/<int:value1>/<int:value2>", methods=['POST'])
@login_required
def update_multiple_record(id, type, value1, value2):
    res = {"code": 0, "message": ""}
    if not type or type == "" or not id or id == "" or not value1 or value1 == "" or not value2 or value2 == "":
        res["code"] = 300
        res["message"] = "请输入有效信息！"
        return jsonify(res)
    else:
        conn, c = connect()
        if type == 3:
            c.execute('''UPDATE test_list SET class=?,grade=? WHERE id=?''', (value1, value2, id))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)
        else:
            conn.close()
            res["code"] = 400
            res["message"] = "更改类型不可用！"
            return jsonify(res)
