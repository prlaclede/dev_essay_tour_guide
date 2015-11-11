from modules.database.database import Base
from sqlalchemy import Column, Integer, String, Float

class Marker(Base):
    __tablename__ = 'markers'
    id = Column(Integer, primary_key=True)
    address = Column(String(300), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    def __init__(self, address=None, latitude=None, longitude=None):
        self.address = address
        self.latitude = latitude
        self.longitude = longitude
        
    def __repr__(self):
      returnList = "['id': '%s', 'address': '%s', 'latitude': '%s', 'longitude': '%s']" % (
        self.id, self.address, self.latitude, self.longitude)
      #returnList = "({'name': '%s'})" % (self.name)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'address': self.address,
       'latitude': self.latitude,
       'longitude': self.longitude
      }
    