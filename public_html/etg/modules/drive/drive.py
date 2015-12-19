from oauth2client.client import GoogleCredentials
from oauth2client import GOOGLE_TOKEN_URI
from apiclient.discovery import build
from httplib2 import Http
import json 

class Drive():
  
  with open('protected/client_secret.json') as secret_file:
    secret = json.load(secret_file)
  
  access_token = None
  token_expiry = None
  token_uri = GOOGLE_TOKEN_URI
  user_agent = 'Essay Tour Guide Application'
  revoke_uri = None
  client_id = secret['web']['client_id']
  client_secret = secret['web']['client_secret']
  refresh_token = '1/LPNqNdrqlOO_Zcjv7eSt5CRVv61E4BpDbaFKrpqIcoE'
    
  def getCreds(self):
    gCreds = GoogleCredentials ( 
      self.access_token, 
      self.client_id,
      self.client_secret, 
      self.refresh_token, 
      self.token_expiry,
      self.token_uri, 
      self.user_agent,
      self.revoke_uri
    )
    
    return gCreds
    
  def buildService(self, creds):
    http_auth = creds.authorize(Http())
    driveService = build('drive', 'v2', http=http_auth)
    
    return driveService
  
  def getItem(self, files, searchItem):
    items = files.get('items')
    returnId = ''
    
    for item in items:
      if (item['title'] == searchItem):
        returnId = item['id']
  
    return returnId 
    
  

