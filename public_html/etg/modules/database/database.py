from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import class_mapper

engine = create_engine('mysql://elizabet_nfadmin:essaytourp@$$@localhost/elizabet_essay_tour_db', convert_unicode=True)
session_factory = sessionmaker(autoflush=True, expire_on_commit=False, bind=engine)
db_session = scoped_session(session_factory)

Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    Base.metadata.create_all(bind=engine)
    