import sqlite3
import os
import sys
from werkzeug.security import generate_password_hash, check_password_hash

filename = 'score-manager.db'


def preload():
    if not os.path.exists(filename):
        conn = sqlite3.connect(filename)
        c = conn.cursor()
        if getattr(sys, 'frozen', False):
            # 如果应用已被打包
            base_path = sys._MEIPASS
        else:
            base_path = os.path.dirname(__file__)
        sql_file_path = os.path.join(base_path, 'preload.sql')
        with open(sql_file_path, 'r', True, 'UTF-8') as f:
            c.executescript(f.read())
        conn.commit()
        conn.close()


def connect():
    conn = sqlite3.connect(filename)
    c = conn.cursor()
    return conn, c


def is_column_exists(table_name, column_name):
    """
    Check if a column exists in a table.

    Parameters:
    - table_name: The name of the table.
    - column_name: The name of the column to check.
    - conn: SQLite connection object.

    Returns:
    - True if the column exists, False otherwise.
    """
    conn, _ = connect()
    query = f"PRAGMA table_info({table_name});"
    cursor = conn.execute(query)

    # Fetch all rows from the result set
    columns = [column[1] for column in cursor.fetchall()]

    # Check if the specified column exists in the list of columns
    return column_name in columns


def encrypt(content):
    crypt = generate_password_hash(content)
    return crypt


def decrypt(content, crypt):
    return check_password_hash(crypt, content)
