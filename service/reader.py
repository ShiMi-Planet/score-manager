import easyocr
import base64
from io import BytesIO
from PIL import Image
import PIL
from flask import jsonify
import os
import re

def ocr(data):
    if not data:
        return None

    # 使用正则表达式移除图像数据前缀
    pattern = r'^data:image/[^;]+;base64,'
    data = re.sub(pattern, '', data, flags=re.IGNORECASE)

    try:
        # 解码Base64字符串
        image_data = base64.b64decode(data)
        # 使用BytesIO将解码后的数据转换为字节流
        image = Image.open(BytesIO(image_data))
        # 确保图像是以正确的模式加载
        image = image.convert('RGB')

        image.save('request.png')
        reader = easyocr.Reader(['en'],gpu=False,model_storage_directory="./",download_enabled=False)
        result = reader.readtext(image="./request.png",paragraph=True,detail=False)
        os.remove("./request.png")
    except base64.binascii.Error as e:
        result = None
    except PIL.UnidentifiedImageError as e:
        result = None
    except Exception as e:
        result = None
    
    return result