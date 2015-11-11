from modules.database.database import Base
from sqlalchemy import Column, Integer, String, Text

class Essay(Base):
    __tablename__ = 'essays'
    id = Column(Integer, primary_key=True)
    pending = Column(Integer, nullable=False, default=1)
    title = Column(String(140), nullable=False)
    drive_id = Column(String(140), nullable=False)
    marker_id_fk = Column(Integer, nullable=False)
    user_id_fk = Column(Integer, nullable=False)
    
    def __init__(self, pending=None, title=None, drive_id=None, marker_id_fk=None, user_id_fk=None):
        self.title = title
        self.drive_id = drive_id
        self.pending = pending
        self.marker_id_fk = marker_id_fk
        self.user_id_fk = user_id_fk
        
    def __repr__(self):
        returnList = "['id': '%s', 'pending': '%s', 'title': '%s', 'drive_id': '%s', 'marker_id_fk': '%s', 'user_id_fk': '%s']" % (
            self.id, self.pending, self.title, self.drive_id, self.marker_id_fk, self.user_id_fk)
        return returnList 
      
    @property
    def serialize(self):
        return {
           'id': self.id,
           'pending': self.pending,
           'title': self.title,
           'drive_id': self.drive_id,
           'marker_id_fk': self.marker_id_fk,
           'user_id_fk': self.user_id_fk
        }