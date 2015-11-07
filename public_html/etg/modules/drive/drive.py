from oauth2client.client import GoogleCredentials
from oauth2client import GOOGLE_TOKEN_URI

class Drive():
  
  access_token = None
  token_expiry = None
  token_uri = GOOGLE_TOKEN_URI
  user_agent = 'Python client library'
  revoke_uri = None
  client_id = '392210443659-l9pit5okd8sst1f75q6foc07l09dk1oe.apps.googleusercontent.com'
  client_secret = 'S_zvMtFEeLVrgSO8Me0XH-7E'
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

