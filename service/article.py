import base64
from io import BytesIO
from PIL import Image
from setting import *
from config import *
from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required
from flaskext.markdown import Markdown
from spark import genReport
import reader

article = Blueprint("article", __name__)


@article.route("/ocr/<int:otype>", methods=["POST"])
@login_required
def ocr_article(otype):
    res = {"code": 0, "message": ""}
    data = request.form.get("data")
    result = reader.ocr(data)
    if result == None:
        res["code"] = 500
        res["message"] = "英文识别失败！"
    else:
        conn, c = connect()
        if otype == 1:
            advice = get_advice(result[0])
            c.execute('''INSERT INTO article (article,img,report) VALUES (?,?,?)''', (result[0], data,advice))
        elif otype == 0:
            c.execute('''INSERT INTO article (article,img) VALUES (?,?)''', (result[0], data))
        conn.commit()
        conn.close()
        res["code"] = 200
        res["message"] = "success"
    return jsonify(res)


def get_advice(result):
    if result == None:
        return None
    else:
        q = f"你现在是一位资深的中学英语教师，你需要对我不理解的英语文章进行解读，现在请你根据我给出的英语文章进行翻译并进行理解分析，使得我能够更好的理解文章，同时，你还可以将文段中重要的单词短语进行摘抄，并给出相关释义，以便我复习。文章如下：{result}"
        # realize = genReport(q)[1]['content']
        realize = genReport(q)
        return realize


@article.route("/list", methods=["GET"])
@login_required
def get_list():
    res = {"code": 0, "message": ""}
    conn, c = connect()
    alist = c.execute('''SELECT id,article,img FROM article ORDER BY id DESC''').fetchall()
    conn.close()
    res["data"] = list()
    for id, article, img in alist:
        res["data"].append({
            "id": id,
            "article": str(article)[:50]+"...",
            "image": img
        })
    res["code"] = 200
    res["message"] = "success"
    return jsonify(res)


@article.route("/detail/<int:id>", methods=["GET"])
@login_required
def detail(id):
    res = {"code": 0, "message": ""}
    if id == "" or id is None:
        res["code"] = 400
        res["message"] = "参数错误！"
        return jsonify(res)
    else:
        conn, c = connect()
        count = c.execute('''SELECT COUNT(*) FROM article WHERE id=?''', (id,)).fetchone()[0]
        if count == 0:
            conn.close()
            res["code"] = 400
            res["message"] = "未查找到相关记录！"
            return jsonify(res)
        else:
            detail = c.execute('''SELECT article,img FROM article WHERE id=?''', (id,)).fetchone()
            res["article"] = detail[0]
            res["img"] = detail[1]
            res["code"] = 200
            res["message"] = "success"
            conn.close()
            return jsonify(res)


@article.route("/ana/<int:id>", methods=["GET"])
@login_required
def article_ana(id):
    if id == "" or id is None:
        return render_template("md.html", markdown_content="(None)")
    else:
        conn, c = connect()
        article = c.execute('''SELECT report FROM article WHERE id=?''', (id,)).fetchone()[0]
        conn.close()
        if article is None:
            return render_template("md.html", markdown_content="(None)")
        else:
            return render_template("md.html", markdown_content=article)


@article.route("/delete",methods=["POST"])
@login_required
def delete_record():
    res = {"code": 0, "message": ""}
    id = request.form.get("id")
    if id is None or id == "":
        res["code"] = 500
        res["message"] = "数据不完整！"
        return jsonify(res)
    else:
        conn,c = connect()
        count = c.execute('''SELECT COUNT(*) FROM article WHERE id=?''',(id,)).fetchone[0]
        if count == 0:
            conn.close()
            res["code"] = 500
            res["message"] = "未查找到相应记录！"
            return jsonify(res)
        else:
            c.execute('''DELETE FROM article WHERE id=?''',(id,))
            conn.commit()
            conn.close()
            res["code"] = 200
            res["message"] = "success"
            return jsonify(res)