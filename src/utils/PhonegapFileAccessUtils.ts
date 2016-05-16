
module Coveo {

  export class PhonegapFileAccess {
    public _success: (data: string) => void;
    public _error: (error: any) => void;
    constructor(public filename: string, public flags: Flags) {

    }

    public done(success: (data: string) => void) {
      this._success = success;
      return this;
    }

    public fail(error: (error: any) => void) {
      this._error = error;
      return this;
    }

    public tryAccess() {
      this.tryGetFilesystem();
    }

    public _onGotFileEntry(fileEntry: FileEntry) {
      //Do nothing in parent class
      return;
    }

    private tryGetFilesystem() {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $.proxy(this._gotFileSystem, this), $.proxy(this.onError, this))
    }

    public _gotFileSystem(fileSystem: FileSystem) {
      fileSystem.root.getFile(this.filename, this.flags, $.proxy(this._onGotFileEntry, this), $.proxy(this.onError, this))
    }

    private onError(error: any) {
      this._error(error);
    }
  }

  export class PhonegapFileReader extends PhonegapFileAccess {

    constructor(filename: string) {
      super(filename, null);
    }

    public read() {
      this.tryAccess();
      return this;
    }

    public _onGotFileEntry(fileEntry: FileEntry) {
      this.gotFileEntry(fileEntry);
    }

    private gotFileEntry(fileEntry: FileEntry) {
      fileEntry.file($.proxy(this.gotFile, this), $.proxy(this._error, this))
    }

    public gotFile(file: File) {
      var reader = new FileReader();
      reader.onloadend = (evt: any) => {
        if(this._success) {
          this._success(evt.target.result);
        }
      };
      reader.readAsText(file);
    }
  }

  export class PhonegapFileWriter extends PhonegapFileAccess {
    private content: string;
    constructor(filename: string, public append = false) {
      super(filename, {create: true, exclusive: false});
    }

    public write(content: string) {
      this.content = content;
      this.tryAccess()
      return this;
    }

    public _onGotFileEntry(fileEntry: FileEntry) {
      fileEntry.createWriter($.proxy(this.gotFileWriter, this), $.proxy(this._error, this))
    }

    private gotFileWriter(writer: FileWriter) {
      writer.onwriteend = (evt) => {
        if(this._success) {
          this._success(evt);
        }
      };
      if(this.append) {
        writer.seek(writer.length)
      };
      writer.write(this.content);
    }
  }
}

