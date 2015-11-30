from etg.modules.database.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import sessionmaker

class Marker(Base):
    __tablename__ = 'markers'
    id = Column(Integer, primary_key=True)
    pending = Column(Boolean, nullable=False, default=True)
    address = Column(String(200), nullable=False)
    latitude = Column(Float(8,6), nullable=False)
    longitude = Column(Float(8,6), nullable=False)
    
    def __init__(self, pending=None, address=None, latitude=None, longitude=None):
        self.pending = pending
        self.address = address
        self.latitude = latitude
        self.longitude = longitude
        
    def __repr__(self):
      returnList = "['id': '%s', 'pending': '%s', 'address': '%s', 'latitude': '%s', 'longitude': '%s']" % (
        self.id, self.pending, self.address, self.latitude, self.longitude)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'pending': self.pending,
       'address': self.address,
       'latitude': self.latitude,
       'longitude': self.longitude
      }
    