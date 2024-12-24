function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const config = {
  apiKey: "AIzaSyDWEAKM8vtxM1YFvj9cRS6UjxzrsL94qDw",
  authDomain: "irunblocked-6441a.firebaseapp.com",
  databaseURL: "https://irunblocked-6441a-default-rtdb.firebaseio.com/",
  projectId: "irunblocked-6441a",
  storageBucket: "irunblocked-6441a.appspot.com",
  messagingSenderId: "568774007267" };

firebase.initializeApp(config);

const App = () =>
  /*#__PURE__*/
  React.createElement(
    "div",
    { className: "comments" } /*#__PURE__*/,
    React.createElement(CommentForm, null) /*#__PURE__*/,
    React.createElement(CommentList, null) /*#__PURE__*/
  );

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem("username") || "",
      comment: "",
      imageUploaded: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  formatTime() {
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    let now = new Date().toLocaleString("en-US", options);
    return now;
  }

  escapeHTML(html) {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
  }

  handleSubmit(e) {
    e.preventDefault();

          // Blocked words list
          const blockedWords = [
            "nigga",
            "nigger",
            "fag",
            "faggot",
            "coon",
            "beaner",
            "cunt",
            "kike",
            "niggers",
            "faggots",
            "fags",
            "niggas",
            "niggerr",
            "niggerrs",
            "niggerrss",
            "niggerrsss",
            "niggerss",
            "niggersss",
            "Nigga",
            "Nigger",
            "Fag",
            "Faggot",
            "Coon",
            "Beaner",
            "Cunt",
            "Kike",
            "Niggers",
            "Faggots",
            "Fags",
            "Niggas",
            "Niggerr",
            "Niggerrs",
            "Niggerrss",
            "Niggerrsss",
            "Niggerss",
            "Niggersss",
            "niggÃƒÆ’Ã‚Â¡",
            "NiggÃƒÆ’Ã‚Â¡",
            "niggaÃƒÆ’Ã‚Â¡",
            "NiggaÃƒÆ’Ã‚Â¡",
            "nigggÃƒÆ’Ã‚Â¡",
            "NigggÃƒÆ’Ã‚Â¡",
            "nigggaÃƒÆ’Ã‚Â¡",
            "NigggaÃƒÆ’Ã‚Â¡",
            "nigÃƒÆ’Ã‚Â¡",
            "NigÃƒÆ’Ã‚Â¡",
            "niga",
            "Niga",
            "NIGGA",
            "NIGGER",
            "NIGGERS",
            "NIGGAS",
            "Ãƒâ€¢Ã‚Â¸igga",
            "Ãƒâ€¢Ã‚Â¸iggas",
            "Ãƒâ€¢Ã‚Â¸igger",
            "Ãƒâ€¢Ã‚Â¸iggers",
            "nigg",
            "Nigg",
            "NIGG",
            "nlgg",
            "nigGa",
            "NiggA",
            "NIgga",
            "NIGga",
          ];
      
          // Function to check if a string contains blocked words
          const hasBlockedWords = (str) => {
            const words = str.split(" ");
            return words.some((word) => blockedWords.includes(word.toLowerCase()));
          };
      
          // Check if the comment contains blocked words
          if (hasBlockedWords(this.state.comment)) {
            alert(
              "You cannout have comments containing blacklisted words"
            );
            return;
          }
      
          // Check if the username contains blocked words
          if (hasBlockedWords(this.state.username)) {
            alert(
              "You cannout have names containing blacklisted words"
            );
            return;
          }
  
    this.setState({ username: "", comment: "" });
  
    const { username, comment, image, video } = this.state;
  
    if ((localStorage.getItem("username") || username).trim() !== "") {
      if (video) {
        const uploadVideo = () => {
          const uploadTask = firebase
            .storage()
            .ref(`videos/${video.name}`)
            .put(video);
  
          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Progress monitoring (if needed)
              },
              (error) => {
                reject(error); // Handle any upload errors
              },
              () => {
                // Video uploaded successfully
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then((url) => resolve(url))
                  .catch((error) => reject(error));
              }
            );
          });
        };
  
        this.setState({ imageUploaded: false }); // Reset the videoUploaded state before uploading
  
        uploadVideo()
          .then((videoURL) => {
            // Video uploaded, proceed with creating the comment
            const user = {
              username: this.escapeHTML(localStorage.getItem("username")),
              comment: this.escapeHTML(comment),
              time: this.formatTime(),
              video: videoURL,
            };
  
            const db = firebase.database().ref("comments");
            db.push(user, () => {});
  
            const newComment = {
              id: newCommentRef.key,
              ...user,
            };
  
            this.setState((prevState) => ({
              comments: [newComment, ...prevState.comments],
            }));
            this.setState({ imageUploaded: false }); // Reset the videoUploaded state before uploading
          })
          .catch((error) => {
            console.error("Error uploading video:", error);
          })
          .finally(() => {
            // Clear the video field and revoke the object URL
            this.setState({ video: undefined, imageUploaded: false });
            if (video) {
              URL.revokeObjectURL(video);
            }
          });
      } else if (image) {
        // Image uploaded
        const uploadImage = () => {
          const uploadTask = firebase
            .storage()
            .ref(`images/${image.name}`)
            .put(image);
  
          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Progress monitoring (if needed)
              },
              (error) => {
                reject(error); // Handle any upload errors
              },
              () => {
                // Image uploaded successfully
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then((url) => resolve(url))
                  .catch((error) => reject(error));
              }
            );
          });
        };
  
        this.setState({ imageUploaded: false }); // Reset the imageUploaded state before uploading
  
        uploadImage()
          .then((imageURL) => {
            // Image uploaded, proceed with creating the comment
            const user = {
              username: this.escapeHTML(localStorage.getItem("username")),
              comment: this.escapeHTML(comment),
              time: this.formatTime(),
              image: imageURL,
            };
  
            const db = firebase.database().ref("comments");
            db.push(user, () => {});
  
            const newComment = {
              id: newCommentRef.key,
              ...user,
            };
  
            this.setState((prevState) => ({
              comments: [newComment, ...prevState.comments],
            }));
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          })
          .finally(() => {
            // Clear the image field and revoke the object URL
            this.setState({ image: undefined, imageUploaded: false });
            if (image) {
              URL.revokeObjectURL(image);
            }
          });
      } else if (comment.trim() !== "") {
        // No image or video uploaded, but comment is not empty, proceed with creating the comment
        const user = {
          username: this.escapeHTML(localStorage.getItem("username")),
          comment: this.escapeHTML(comment),
          time: this.formatTime(),
        };
  
        const db = firebase.database().ref("comments");
        db.push(user, () => {});
  
        const newComment = {
          id: newCommentRef.key,
          ...user,
        };
  
        this.setState((prevState) => ({
          comments: [newComment, ...prevState.comments],
        }));
      } else {
        this.setState({ validationError: true }); // Set validation error to true
      }
    }
  }
  
  handleImageChange(e) {
    const file = e.target.files[0];
    const fileType = file.type.split('/')[0]; // Get the type of the uploaded file
  
    if (fileType === 'image') {
      // Image uploaded
      this.setState({
        image: file,
        video: null, // Clear the video if an image is uploaded
        imageUploaded: true, // Update the imageUploaded state
      });
    } else if (fileType === 'video') {
      // Video uploaded
      if (file.size <= 5 * 1024 * 1024) {
        // Check if file size is less than or equal to 10MB (10 * 1024 * 1024 bytes)
        this.setState({
          video: file,
          image: null, // Clear the image if a video is uploaded
          imageUploaded: true, // Update the imageUploaded state
        });
      } else {
        alert('Maximum video file size is 5MB. Please choose a smaller video or compress the video.');
      }
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "username") {
      localStorage.setItem("username", e.target.value);
    }

    if (e.target.name === "username" && e.target.value === "") {
      e.target.setAttribute(
        "placeholder",
        localStorage.getItem("username") || "Name"
      );
    }

    if (e.target.name === "image") {
      if (!e.target.value) {
        // Clear image when input is empty
        this.setState({ image: null });
      }
    }
  }

  handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line in textarea

      const { username, comment } = this.state;

      if (
        (localStorage.getItem("username") || username).trim() !== "" &&
        comment.trim() !== ""
      ) {
        this.handleSubmit(event);
      } else {
        this.setState({ validationError: true }); // Set validation error to true
      }
    }
  }

  render() {
    const { imageUploaded, username, comment } = this.state;

    return /*#__PURE__*/ React.createElement(
      "div",
      { className: "comments-form" },
      /*#__PURE__*/ React.createElement(
        "form",
        { onSubmit: this.handleSubmit },
        /*#__PURE__*/ React.createElement(
          "ul",
          null,
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            /*#__PURE__*/
            React.createElement("input", {
              name: "username",
              type: "text",
              className: "name",
              placeholder: localStorage.getItem("username") || "Name",
              value: localStorage.getItem("username"),
              onChange: this.handleChange,
              onKeyDown: this.handleKeyPress,
              required: true,
            })
          ),
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            /*#__PURE__*/ React.createElement("textarea", {
              name: "comment",
              placeholder: "Message",
              value: comment,
              onChange: this.handleChange,
              onKeyDown: this.handleKeyPress,
              required: false,
            })
          ),
          /*#__PURE__*/ React.createElement(
            "li",
            null,
            /*#__PURE__*/ React.createElement(
              "label",
              { htmlFor: "file-input", className: "file-input-label" },
              imageUploaded
                ? /*#__PURE__*/ React.createElement("img", {
                    src: "/assets/images/Uploaded-Image.png",
                    alt: "Uploaded Image",
                    className: "file-input-icon",
                  })
                : /*#__PURE__*/ React.createElement("img", {
                    src: "/assets/images/Upload-Image.png",
                    alt: "Upload Image",
                    className: "file-input-icon",
                  })
            ),
            /*#__PURE__*/ React.createElement("input", {
              id: "file-input",
              type: "file",
              accept: "image/*, video/*",
              onChange: this.handleImageChange,
            })
          
          )
        )
      )
    );
  }
}

class CommentList extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", { comments: [] });
  }

  componentDidMount() {
    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {
      this.setState({ username: savedUsername });
    }

    const db = firebase.database().ref("comments");

    db.on("value", (snapshot) => {
      if (snapshot) {
        const commentsObject = snapshot.val();
        const comments = Object.keys(commentsObject).map((key) => ({
          id: key,
          ...commentsObject[key],
        }));

        this.setState({
          comments: comments.reverse(),
        });

        // Check if there are more than ten comments
        if (comments.length > 10) {
          // Calculate how many comments need to be removed
          const commentsToRemove = comments.length - 10;

          // Get the IDs of the comments to be removed (oldest comments)
          const commentsToDelete = comments.slice(-commentsToRemove).map((comment) => comment.id);

          // Remove the oldest comments from the database
          commentsToDelete.forEach((commentId) => {
            const commentToRemove = comments.find((comment) => comment.id === commentId);
            if (commentToRemove) {
              // Check if the comment has an associated image or video
              if (commentToRemove.image) {
                // Delete the image from Firebase Storage
                const imageRef = firebase.storage().refFromURL(commentToRemove.image);
                imageRef.delete()
                  .then(() => {
                    console.log("Image deleted successfully");
                  })
                  .catch((error) => {
                    console.error("Error deleting image:", error);
                  });
              } else if (commentToRemove.video) {
                // Delete the video from Firebase Storage
                const videoRef = firebase.storage().refFromURL(commentToRemove.video);
                videoRef.delete()
                  .then(() => {
                    console.log("Video deleted successfully");
                  })
                  .catch((error) => {
                    console.error("Error deleting video:", error);
                  });
              }

              // Remove the comment from the database
              db.child(commentId).remove();
            }
          });

          // Update the state to remove the oldest comments from the displayed list
          this.setState((prevState) => ({
            comments: prevState.comments.slice(0, -commentsToRemove),
          }));
        }
      }
    });

    db.on("child_added", (snapshot) => {
      const newComment = {
        id: snapshot.key,
        ...snapshot.val(),
      };
      this.setState((prevState) => ({
        comments: [newComment, ...prevState.comments],
      }));
    });
  }

  render() {
    const { imageUploaded, comments } = this.state;

    return /*#__PURE__*/ React.createElement(
      "div",
      { className: "comments-list" },
      comments.map((comment, index) =>
        /*#__PURE__*/ React.createElement(Comment, {
          key: index,
          username: comment.username,
          comment: comment.comment,
          time: comment.time,
          image: comment.image,
          video: comment.video,
        })
      )
    );
  }
}

const Comment = ({ username, comment, time, image, video }) =>
  React.createElement(
    "div",
    { className: "comment" },
    React.createElement("h4", null, username),
    React.createElement("p", { className: "timestamp" }, time),
    React.createElement("p", { style: { wordWrap: 'break-word' } }, comment), // Apply word-wrap CSS style
    image &&
      React.createElement("img", { src: image, alt: "Uploaded" }), // Display the image if available
    video &&
      React.createElement("video", { src: video, controls: true }) // Display the video if available
  );

const mountNode = document.getElementById("app");
ReactDOM.render(/*#__PURE__*/ React.createElement(App, null), mountNode);

document.addEventListener("DOMContentLoaded", () => {
  const cursorSelect = document.getElementById("custom-cursor");
  const cursors = {
    wand: {
      default: "url('/assets/cursors/Magic/pointer.png'), auto",
      link: "url('/assets/cursors/Magic/link.png'), pointer",
    },
    geo: {
      default: "url('/assets/cursors/Geometry-Dash/pointer.png'), auto",
      link: "url('/assets/cursors/Geometry-Dash/link.png'), pointer",
    },
    halo: {
      default: "url('/assets/cursors/Halo/pointer.png'), auto",
      link: "url('/assets/cursors/Halo/link.png'), pointer",
    },
    tt: {
      default: "url('/assets/cursors/TT/pointer.png'), auto",
      link: "url('/assets/cursors/TT/link.png'), pointer",
    },
    harley: {
      default: "url('/assets/cursors/Harley/pointer.png'), auto",
      link: "url('/assets/cursors/Harley/link.png'), pointer",
    },
  };

  const applyCursor = (cursorType) => {
    let cursorStyle = document.getElementById("dynamic-cursor-style");
    if (!cursorStyle) {
      cursorStyle = document.createElement("style");
      cursorStyle.id = "dynamic-cursor-style";
      document.head.appendChild(cursorStyle);
    }
  
    const { default: defaultCursor, link: linkCursor } = cursors[cursorType] || cursors.wand;
  
    cursorStyle.textContent = `* { cursor: ${defaultCursor} !important; } a, button, img { cursor: ${linkCursor} !important; }`;
  
    if (localStorage.getItem('selectedCursor') !== cursorType && isSFXEnabled()) {
      const sound = new Audio('assets/sfx/dragonvale-vaultofabundance.mp3');
      sound.play();
    }
  };  

  const savedCursor = localStorage.getItem('selectedCursor') || 'wand';
  applyCursor(savedCursor);
  cursorSelect.value = savedCursor;

  cursorSelect.addEventListener("change", (event) => {
    const selectedCursor = event.target.value;
    applyCursor(selectedCursor);
    localStorage.setItem('selectedCursor', selectedCursor);
  });
});