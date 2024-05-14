from flask import Blueprint, request, jsonify
from flask_login import login_required
from config import *
from setting import *

subject = Blueprint('subject', __name__)


@subject.route('/list', methods=['GET'])
@login_required
def list_subjects():
    res = {"code": 0, "message": ""}
    method = request.args.get("method")
    conn, c = connect()
    if method == "true":
        list = c.execute('''SELECT subject,subject_name,state,full_score,color,id FROM subject WHERE state=1''').fetchall()
    else:
        list = c.execute('''SELECT subject,subject_name,state,full_score,color,id FROM subject''').fetchall()
    res["subject"] = []
    for n in range(len(list)):
        i = list[n]
        res["subject"].append({
            "id": i[5],
            "subject": i[0],
            "subject_name": i[1],
            "state": i[2],
            "full_score": i[3],
            "color": i[4]
        })
    conn.close()
    res["total"] = len(list)
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)


@subject.route('/update', methods=['POST'])
@login_required
def upadte_subject():
    res = {"code": 0, "message": ""}
    subject_list = request.form.get("subject_list").split(",")
    state_list = request.form.get("state_list").split(",")
    score_list = request.form.get("score_list").split(",")
    color_list = request.form.get("color_list").split(";")
    l = []
    conn, c = connect()
    for i in range(len(subject_list)):
        s = subject_list[i]
        t = state_list[i]
        r = score_list[i]
        co = color_list[i]
        if co == "" or not c:
            co = "250,150,170"
        l.append((t == "true", r, co, s))
        # if t == "true":
        #     if is_column_exists("test_list", s):
        #         continue
        #     else:
        #         conn.execute(f'ALTER TABLE test_list ADD COLUMN {s} int')
        #         conn.commit()
        # else:
        #     if is_column_exists("test_list", s):
        #         conn.execute(f'ALTER TABLE test_list DROP COLUMN {s}')
        #         conn.commit()
        #     else:
        #         continue
    c.executemany('''UPDATE subject SET state=?,full_score=?,color=? WHERE subject=?''', l)
    conn.commit()
    conn.close()
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)
