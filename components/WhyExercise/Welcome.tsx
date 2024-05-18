import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import Webcam from "react-webcam";

interface Props {
  setName: (name: string) => void;
  setPhoto: (photo: string | null) => void;
  photo: string | null;
  handleExit: () => void;
}

export default function Welcome({ setName, setPhoto, photo, handleExit }: Props) {
  const [nameError, setNameError] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    setShowWebcam(false);

    fileRef.current!.click();
    handleClose();
  };

  const handleWebcamClick = () => {
    setPhoto(null);
    fileRef.current!.value = "";

    setShowWebcam(true);
    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const name = formJson.name.trim();

    name.length === 0 ? setNameError(true) : setName(name);

    if (showWebcam && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
    }
  };

  return (
    <Dialog open={true}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Welcome</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              "Before we start the 'Why' exercise, please provide your name and photo. Your input will help tailor this experience just for you."
            }
          </DialogContentText>
          <TextField
            label="Full Name"
            variant="standard"
            name="name"
            fullWidth
            autoFocus
            margin="dense"
            autoComplete="off"
            error={nameError}
            helperText={nameError && "Please enter your name."}
            onChange={(event) => setNameError(event.target.value.trim().length === 0)}
          />
          <Box mt={3} p={3} textAlign="center" border="dashed 1px #9e9e9e">
            {!showWebcam ? (
              <Image
                src={photo || "/images/why-exercise/placeholder.png"}
                width={200}
                height={200}
                alt=""
                priority
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            ) : (
              <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} width={200} height={200} />
            )}
            <Box>
              <Button size="small" startIcon={<AddIcon />} onClick={handleClick}>
                Upload Photo
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleUploadClick}>Upload from Computer</MenuItem>
                <MenuItem onClick={handleWebcamClick}>Take from Webcam</MenuItem>
              </Menu>
              <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExit}>Cancel</Button>
          <Button type="submit">Start</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
