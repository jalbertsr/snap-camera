import React from "react";
import Webcam from "react-webcam";
import AWS from "aws-sdk";

class WebcamCapture extends React.Component {
  constructor(props) {
    super(props);
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID, 
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  }
  componentDidMount() {
    this.cameraName = prompt("Name of the camera:");
    this.timerID = setInterval(() => {
      const imageSrc = this.capture();
      if (imageSrc) this.s3Upload(imageSrc);
    }, 4000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => this.webcam.getScreenshot();

  s3Upload = image => {
    const imageData = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = new Buffer(imageData, "base64");
    const s3 = new AWS.S3();
    s3.putObject(
      {
        Bucket: "rekognition-adihack", //1. Bucket Name
        Key: this.cameraName + "/" + new Date().toJSON() + ".jpeg", // 2. Name of the file
        Body: buffer, // 3. File you want to upload
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
      },
      resp => console.log("Successfully uploaded image.");
    );
  };

  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={550}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={550}
        />
      </div>
    );
  }
}

export default WebcamCapture;
