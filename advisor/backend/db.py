# db.py — direct PostgreSQL access for lecturer features

import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/studentreach"


def query(sql, params=None):
    """Run a read query, return list of dicts."""
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            return cur.fetchall()


def execute(sql, params=None):
    """Run an insert/update, return the row if RETURNING is used."""
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            try:
                result = cur.fetchall()
            except psycopg2.ProgrammingError:
                result = []
            conn.commit()
            return result