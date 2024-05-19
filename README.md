# score-manager
This project is local-build system with python Flask as the backend service and with Bootstrap as front page, in order to manage student's personal test data and let them visible easily.

> ***Specially Metioned***: In the web font page, at the *Upload Correct Question* page, the image upload service is now using service served by [喷子图床](https://pz.al/), and the privacy is not verified now, and please **do not upload the image break the local law**! And if break the law with the service, it **has no relationship with me(*Author: `lipeilin375`*)** at all! Please make sure about that! Thanks for your understanding. Have a good trip!

## Content
- [Environment Required](#environment-required)
- [Deploy Method](#deploy-method)
- [Contribute Instruction](#contribute-instruction)
    - [For web page developper](#for-web-page-developper)
    - [For service developper](#for-service-developper)
- [TODO List](#todo-list)
- [Update History](#update-history)
- [Thanks For Technology Providers Used in This Project](#thanks-for-technology-providers-used-in-this-project)
- [Welcome Contact For Further Communication](#welcome-contact-for-further-communication)
- [Donate](#donate)

## Environment Required
> This project is a font and back separated application, and the font page is designed with `HTML`, the service is provided by `Python Flask` structure. By the way, the data storage method is under `sqlite` database.
>
> This project is welcoming more contributors to use better plugins.

All the environment you need is:
1. A personal computer with `Python 3.x` (As I develop it in `anaconda` with `Python 3.12.1`)
2. A browser that can be used to see the web page (Also, this project is adapted to Pad and Phone)
3. (Optional) if you want to share the data in a network, you should plugin your PC to your home WIFI and get the current IP address
4. Have a good trip~

***IMPORTANT*** : When you want to build up the server, some python module is needed!

* [x] `Flask`
* [x] `Flask-login`
* [x] `flask_sqlalchemy`
* [x] `sqlite3`
* [x] `aiohttp`(To make the desktop application run successful with its service provide.)
* [ ] `pillow`

conda method: (**Recommend**: virtual env)
```bash
conda env create -f environment.yaml
```

pip method:
```bash
pip install Flask,flask-login,flask_sqlalchemy,pysqlite3,aiohttp
```

## Deploy Method

1. clone this repository to local
```bash
git clone https://github.com/ShiMi-Planet/score-manager.git
```

2. open cmd in `./score-manager/server` directory, and input as this
```bash
python main.py
```

3. then you can see the information as this
```bash
 * Serving Flask app 'main'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
Press CTRL+C to quit
```

4. start web page server in `./score-manager/web` directory
```bash
python server.py
```

5. then you can see the notice in command
```bash
======== Running on http://0.0.0.0:8080 ========
(Press CTRL+C to quit)
```

6. then the web page service is on, and the default port support is `8080`, by the way, you can open page in browser
```yaml
http://localhost:8080
http://0.0.0.0:8080
http://127.0.0.1:8080
http://192.168.x.x:8080 (recommend)
```

7. enjoy your trip!

## Contribute Instruction

In order to ensure the environment we use is the same, it's recommend that use the `environment.yaml` file to set up new virtual environment in `anaconda`, and you can follow the step like this.

The name of virtual environment is set to `sanager` and you can change it with `-n` option.

```bash
conda env create -f environment.yaml
```

### For web page developper

recommend you to use `live server` in VScode to help develop, beacause of the strict reload principle in aiohttp, and when changed the file locally, you can only need refresh the web page to see the outcome.

the `demo.html` file is for the functional pages' module, and you could follow the instructions below.

*About Card Header*
```html
<header class="card-header">
  <div class="card-title">
    <!-- Put the card title in this place that will be shown in the head of each page's card -->
  </div>
</header>
```

*About Card Content Inside*
```html
<div class="card-body">
  <!-- Put the content you want to show in this place -->
</div>
```

*About refer to special javascript script*
```html
<script src="<!-- The relative or adjust path to your script (Which can also be filled as link like *.js etc.) -->"></script>
```

*By the way, more design module please check up in [Light Year Web Font Page Module](https://gitee.com/yinqi/Light-Year-Admin-Template-v5)*

*Some useful extensions are shown in [Light Year Admin Using v5 For Example](https://gitee.com/yinqi/light-year-admin-using-v5-for-example)*

### For service developper

recommend you to use anaconda environment to update the service and database, by the way, it's a nice choise to use `Pycharm` as your primary tool.

## TODO List

* [ ] *Make the system can be deployed with cluster by **Docker** with **SaaS** method
* [ ] Simple the deploy method in order to use only one command line or action to run back service and web page service in a time.
* [ ] (*Optional) *Ready to build this project into a Java based application*
* [ ] Use PIL and Random module to update the security of login with verifycation code.
* [x] Update the select options in *Upload Correct Question* page.

## Update History

> - ✔ v 2024.05.19 ***Version 2.0.0 Publish***

- 2024.05.19 **Add artificial intelligent reader with Vision Ability (OCR)**
- 2024.05.19 **Fixed some known problem**
- 2024.05.19 **Use `easyocr` to tackle the OCR mission**

> - ✔ iv 2024.02.24 ***Fourth Commit***
- 2024.02.24 **Use `SetupFactory` to build the release setup file**
- 2024.02.24 **Use `.cpp` file and `.bat` file to locally start the service**
- 2024.02.24 **Fixed some exist problems**
- 2024.02.24 **Use `Tauri` to build the *Windows Platform* application**
- 2024.02.23 **Use `pyinstaller` to create the execution file of interface service and web page service**
> - ✔ iii 2024.02.15 ***Third Commit***
- 2024.02.15 **Make some interface better**
- 2024.02.15 **Finish TO-DO:`Update the select options in *Upload Correct Question* page.`**
- 2024.02.14 **Add more interfaces related to correct book service**
- 2024.02.14 **Update the service interface more reasonable**
- 2024.02.14 **Build detail of correct question page**
- 2024.02.14 **Use *layui* module to build the list**
- 2024.02.14 **Build the list of correct questions page**
- 2024.02.13 **Build basic structure of web font page of *Upload Correct Question***
- 2024.02.13 **Add *CKeditor* into *Upload Correct Question* web font page**
- 2024.02.13 **Custom *CKeditor* functions**
- 2024.02.13 **Finish *Upload Correct Question* web font page**
- 2024.02.13 **Finish vd2 database structure and rebuild the back database service**
- 2024.02.12 **Build web font page for detail of each test with ladar gragh etc.**
- 2024.02.12 **Upgrade the back interface more profittable**
> - ✔ ii 2024.02.11 ***Second Commit***
- 2024.02.11 ***Update the environment.yaml file for new features***
- 2024.02.11 **Use** *layui* **module to build the web font page in table element and connected with the back interfaces**
- 2024.02.11 **Add new back interfaces with the service provides for analyze export**
- 2024.02.11 **Make back service better**
    > Upgrade previous interface response data structure and request logic.
- 2024.02.11 **Finish analyze export function's web font page**
> - ✔ i 2024.02.10 ***First Commit***
- 2024.02.09 **Finish score insert function page and service**
- 2024.02.09 **Finish vd1 project's datebase basic structure**
- 2024.02.08 **Finish subject selector page and service**
- 2024.02.08 **Finish change password page design and service**
- 2024.02.08 **Finish home page structure**
- 2024.02.08 **Build vf1 project's file structure**
- 2024.02.07 **Finish session login module**
    > With the `Flask-login` module, this system is designed with session cookie to verify the identity, inorder to ensure the security of users.
- 2024.02.06 **Create project**
    > Because of a moment of heat of head, the author want to build a local-based system to analyze the personal score during all of the test.

## Thanks For Technology Providers Used in This Project

**(Sort in no particular order)*
- [Light Year Web Font Page Module](https://gitee.com/yinqi/Light-Year-Admin-Template-v5)
- [CKeditor](https://ckeditor.com/)
- [Layui Table Module](https://layui.dev/docs/2/table/)
- [喷子图床](https://pz.al/)
- [Gitee AI](https://ai.gitee.com/)
- [EasyOCR](https://github.com/JaidedAI/EasyOCR)
- [OpenAI ChatGPT](https://chat.openai.com/)
- [讯飞开放平台](https://www.xfyun.cn/)

## Welcome Contact For Further Communication

Email: [BillyLin](mailto:billy_lin00@yeah.net)
![](readme_img%2FIMG_0072.JPG)

## Donate
![](readme_img%2F0b0539bff576c5374aa746a8ea0ce3b.jpg)
