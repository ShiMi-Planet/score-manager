import SparkApi

# 以下密钥信息从控制台获取
appid = "XXXXXXXX"  # 填写控制台中获取的 APPID 信息
api_secret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # 填写控制台中获取的 APISecret 信息
api_key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # 填写控制台中获取的 APIKey 信息

# 用于配置大模型版本，默认“general/generalv2”
domain = "generalv3.5"
# 云端环境的服务地址
Spark_url = "wss://spark-api.xf-yun.com/v3.5/chat"


text = []


# length = 0

def getText(role, content):
    jsoncon = {}
    jsoncon["role"] = role
    jsoncon["content"] = content
    text.append(jsoncon)
    return text


def getlength(text):
    length = 0
    for content in text:
        temp = content["content"]
        leng = len(temp)
        length += leng
    return length


def checklen(text):
    while (getlength(text) > 8000):
        del text[0]
    return text


def genReport(marks):
    text.clear
    Input = f'接下来我将告诉你我本次考试的成绩，你的任务是帮我分析我的整体成绩，例如是否偏科、优势科目有哪些以及对于我未来学习规划的建议，你的回答只需要包含分析的内容，不需要复述我的成绩，我的成绩是：{marks}'
    question = checklen(getText("user", Input))
    SparkApi.answer = ""
    # print("星火:", end="")
    SparkApi.main(appid, api_key, api_secret, Spark_url, domain, question)
    return getText("assistant", SparkApi.answer)
    # print(str(text))
