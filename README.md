# score-manager
This project is local-build system with python Flask as the backend service and with Bootstrap as front page, in order to manage student's personal test data and let them visible easily.

## Content
- [Environment Required](#environment-required)
- [Deploy Method](#deploy-method)
- [Update History](#update-history)
- [Donate](#donate)

## Environment Required
> This project is a font and back separated application, and the font page is designed with `HTML`, the service is provided by `Python Flask` structure. By the way, the data storage method is under `sqlite` database.

All the environment you need is:
1. A personal computer with `Python 3.x` (As I develop it in `anaconda` with `Python 3.12.1`)
2. A browser that can be used to see the web page (Also, this project is adapted to Pad and Phone)
3. (Optional) if you want to share the data in a network, you should plugin your PC to your home WIFI and get the current IP address
4. Have a good trip~

***IMPORTANT*** : When you want to build up the server, some python module is needed!

* [x] Flask
* [x] Flask-login
* [x] flask_sqlalchemy
* [x] sqlite3
* [x] aiohttp

conda method: (**Recommend**: virtual env)
```bash
conda install Flask,flask-login,flask_sqlalchemy,pysqlite3,aiohttp
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

```bash
conda env create -f environment.yaml
```

### For web page developper

recommend you to use `live server` in VScode to help develop, beacause of the strict reload principle in aiohttp, and when changed the file locally, you can only need refresh the web page to see the outcome.

### For service developper

recommend you to use anaconda environment to update the service and database, by the way, it's a nice choise to use `Pycharm` as your primary tool.

### For Chinese Mainland developpers

recommend you to use the `environment-zh_cn.yaml` file in the root directory as your anaconda properties import entry, that way, you can prevent the net-work limitation, and enjoy the smooth deploy feelings

## TODO List

* [ ] Use PIL and Random module to update the security of login with verifycation code.

## Update History

- ✔ ii 2024.02.11 ***Second Commit***
- 2024.02.11 ***Update the environment.yaml file for new features***
- 2024.02.11 **Use** *layui* **module to build the web font page in table element and connected with the back interfaces**
- 2024.02.11 **Add new back interfaces with the service provides for analyze export
- 2024.02.11 **Make back service better**
    > Upgrade previous interface response data structure and request logic.
- 2024.02.11 **Finish analyze export function's web font page**
- ✔ i 2024.02.10 ***First Commit***
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

## Donate
![](readme_img%2F0b0539bff576c5374aa746a8ea0ce3b.jpg)