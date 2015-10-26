from modules.database.database import Base
from sqlalchemy import Column, Integer, String, Text

class Essay(Base):
    __tablename__ = 'essays'
    id = Column(Integer, primary_key=True)
    title = Column(String(140), nullable=False)
    location = Column(Text, nullable=False)
    pending = Column(Integer, default=1)
    marker_id_fk = Column(Integer, nullable=False)
    user_id_fk = Column(Integer, nullable=False)
    
    def __init__(self, title=None, location=None, pending=None, marker_id_fk=None, user_id_fk=None):
        self.title = title
        self.location = location
        self.pending = pending
        self.marker_id_fk = marker_id_fk
        self.user_id_fk = user_id_fk
        
    def __repr__(self):
        returnList = "['id': '%s', 'title': '%s', 'location': '%s', 'pending': '%s', 'marker_id_fk': '%s', 'user_id_fk': '%s']" % (
            self.id, self.title, self.location, self.pending, self.marker_id_fk, self.user_id_fk)
        #return '<Essay %r>' % (self.title)
        return returnList 
      
    @property
    def serialize(self):
        return {
           'id': self.id,
           'title': self.title,
           'location': self.location,
           'pending': self.pending,
           'marker_id_fk': self.marker_id_fk,
           'user_id_fk': self.user_id_fk
        }