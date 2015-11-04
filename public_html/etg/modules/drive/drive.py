import os, httplib2, oauth2client, webbrowser
from apiclient import errors
from apiclient.discovery import build
from apiclient.http import MediaFileUpload
from oauth2client import client, tools

class Drive():
    
    try:
        import argparse
        flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
    except ImportError:
        flags = None
    
    SCOPES = 'https://www.googleapis.com/auth/drive.file'
    CLIENT_SECRET_FILE = 'client_secret_py.json'
    APPLICATION_NAME = 'FredEssayTours'
    FLOW = oauth2client.client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)

    def init_exchange(self):
        self.FLOW.redirect_uri = oauth2client.client.OOB_CALLBACK_URN
        return(self.FLOW.client_id, self.FLOW.client_secret)
        return self.FLOW.step1_get_authorize_url()
        auth_uri = self.FLOW.step1_get_authorize_url()
        webbrowser.open_new(auth_uri)
        
        print(":D")
        return ":D"
    
    def get_credentials(self, code):
        credentials = self.FLOW.step2_exchange(code)
        return self.build_service(credentials)
    
    def build_service(self, credentials):
        """Build a Drive service object.
        
        Args:
        credentials: OAuth 2.0 credentials.
        
        Returns:
        Drive service object.
        """
        http = httplib2.Http()
        http = credentials.authorize(http)
        return build('drive', 'v2', http=http)
      
    
    '''def insert_file(service, title, description, parent_id, mime_type, filename):
      """Insert new file.
    
      Args:
        service: Drive API service instance.
        title: Title of the file to insert, including the extension.
        description: Description of the file to insert.
        parent_id: Parent folder's ID.
        mime_type: MIME type of the file to insert.
        filename: Filename of the file to insert.
      Returns:
        Inserted file metadata if successful, None otherwise.
      """
      media_body = MediaFileUpload(filename, mimetype=mime_type, resumable=True)
      body = {
        'title': title,
        'description': description,
        'mimeType': mime_type
      }
      # Set the parent folder.
      if parent_id:
        body['parents'] = [{'id': parent_id}]
    
      try:
        file = service.files().insert(
            body=body,
            media_body=media_body).execute()
    
        # Uncomment the following line to print the File ID
        # print 'File ID: %s' % file['id']
    
        return file
      except errors.HttpError, error:
        print ('An error occured: %s' % error)
        return None'''
