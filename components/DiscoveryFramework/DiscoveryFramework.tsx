"use client";

import { updateCompanyModule, updateUserModule } from "@/app/actions";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import QuizIcon from "@mui/icons-material/Quiz";
import ReplayIcon from "@mui/icons-material/Replay";
import SaveIcon from "@mui/icons-material/Save";
import { Backdrop, Box, Button, IconButton, Paper, Popover, Slider, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState, useTransition } from "react";
import "./styles.scss";

export default function DiscoveryFramework({
  data,
  editMode,
  superAdmin,
}: {
  data: any;
  editMode?: boolean;
  superAdmin?: boolean;
}) {
  const { logo, primaryColor, secondaryColor, company, user, userId, answers, companyId } = data;

  const [preset, setPreset] = useState(!user ? company : user);

  const { title, subtitle, content } = preset;

  const [logoSize, setLogoSize] = useState(preset?.logoSize ? preset?.logoSize : 180);

  const [titleSize, setTitleSize] = useState(title.size);
  const [subtitleSize, setSubtitleSize] = useState(subtitle.size);

  const defaultStyle = {
    "--primaryColor": primaryColor,
    "--primaryTextColor": getContrastColor(primaryColor),
    "--secondaryColor": secondaryColor,
    "--secondaryTextColor": getContrastColor(secondaryColor),
    "--titleSize": titleSize + "px",
    "--subtitleSize": subtitleSize + "px",
  };

  const [visibleIndices, setVisibleIndices] = useState<number[]>([0]);

  const makeVisibleOn = (index: number) => {
    const className = visibleIndices.includes(index) ? "visible" : "hidden";
    return { className };
  };

  const next = useCallback(() => {
    if (visibleIndices.length <= 34) {
      const lastVisibleIndex = visibleIndices[visibleIndices.length - 1];
      setVisibleIndices([...visibleIndices, lastVisibleIndex + 1]);
    }
  }, [visibleIndices, setVisibleIndices]);

  const prev = useCallback(() => {
    if (visibleIndices.length > 1) {
      const updatedIndices = visibleIndices.slice(0, -1);
      setVisibleIndices(updatedIndices);
    }
  }, [visibleIndices, setVisibleIndices]);

  useEffect(() => {
    if (!editMode) {
      const handleKeyDown = (event: KeyboardEvent) => {
        const isInputField = document.activeElement instanceof HTMLInputElement;
        if (!isInputField) {
          if (event.key === "ArrowRight") next();
          if (event.key === "ArrowLeft") prev();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [editMode, next, prev]);

  const screenshotRef = useRef<HTMLDivElement>(null);

  const save = async () => {
    const canvas = await html2canvas(screenshotRef.current!);
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = "discovery-framework.png";
    downloadLink.click();
  };

  const formRef = useRef<HTMLFormElement>(null);

  const reset = () => {
    setVisibleIndices([0]);
    formRef.current!.reset();
  };

  const resetToDefault = () => {
    formRef.current!.reset();

    setPreset(company);
    setTitleSize(company.title.size);
    setSubtitleSize(company.subtitle.size);
  };

  const [isPending, startTransition] = useTransition();

  const doSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(formRef.current!);

    const data = {
      title: {
        text: formData.get("title.text") as string,
        size: parseInt(formData.get("title.size") as string),
      },
      subtitle: {
        text: formData.get("subtitle.text") as string,
        size: parseInt(formData.get("subtitle.size") as string),
      },
      content: {
        left: {
          thoughts: [formData.get("left.thoughts[0]") as string, formData.get("left.thoughts[1]") as string],
          feelings: [formData.get("left.feelings[0]") as string, formData.get("left.feelings[1]") as string],
          actions: [formData.get("left.actions[0]") as string, formData.get("left.actions[1]") as string],
          results: [formData.get("left.results[0]") as string, formData.get("left.results[1]") as string],
        },
        right: {
          thoughts: [formData.get("right.thoughts[0]") as string, formData.get("right.thoughts[1]") as string],
          feelings: [formData.get("right.feelings[0]") as string, formData.get("right.feelings[1]") as string],
          actions: [formData.get("right.actions[0]") as string, formData.get("right.actions[1]") as string],
          results: [formData.get("right.results[0]") as string, formData.get("right.results[1]") as string],
        },
      },
      logoSize,
    };

    startTransition(async () => {
      !superAdmin
        ? await updateUserModule("Discovery Framework", userId, data)
        : await updateCompanyModule("Discovery Framework", companyId, data);
    });
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const renderAnswer = (answer: string, index: number) => {
    const popoverId = `popover-${index}`;

    return (
      <div className="answer">
        <IconButton
          aria-controls={popoverId}
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
        >
          <QuizIcon />
        </IconButton>

        <Popover
          id={popoverId}
          open={Boolean(anchorEl) && anchorEl?.getAttribute("aria-controls") === popoverId}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Paper elevation={6}>
            <Box sx={{ maxWidth: 500, p: 1 }}>{answer}</Box>
          </Paper>
        </Popover>
      </div>
    );
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setLogoSize(newValue);
  };

  return (
    <form ref={formRef} noValidate onSubmit={doSave}>
      <div id="discovery-framework" className={editMode ? "edit-mode" : ""} style={defaultStyle as React.CSSProperties}>
        <div className="wrapper">
          <div className="inner" ref={screenshotRef}>
            {editMode && (
              <>
                <label className="size title">
                  Font Size: &nbsp;
                  <input
                    type="number"
                    defaultValue={titleSize}
                    onChange={(e) => setTitleSize(e.target.value)}
                    name="title.size"
                  />
                </label>

                <label className="size subtitle">
                  Font Size: &nbsp;
                  <input
                    type="number"
                    defaultValue={subtitleSize}
                    onChange={(e) => setSubtitleSize(e.target.value)}
                    name="subtitle.size"
                  />
                </label>
              </>
            )}

            <div className="header">
              <div className="left">
                {editMode ? (
                  <input
                    type="text"
                    defaultValue={title.text}
                    {...makeVisibleOn(1)}
                    readOnly={!editMode}
                    name="title.text"
                  />
                ) : (
                  <span {...makeVisibleOn(1)}>{title.text}</span>
                )}

                {/* prettier-ignore */}
                <svg viewBox="0 0 616.5 54" xmlns="http://www.w3.org/2000/svg"><g><path d="m0 54.9v-53.9h527.7c2.2 0 4 0.5 5.8 1.7l80.7 50.4c0.7 0.5 1.7 0.7 2.2 1.9l-616.4-0.1z" /><path d="M544.7,10H0v36h602.4C583.2,34,564,22,544.7,10z" fill="#fff" fillOpacity=".2" /></g></svg>
              </div>

              <div className="right">
                {editMode ? (
                  <input
                    type="text"
                    defaultValue={subtitle.text}
                    {...makeVisibleOn(2)}
                    readOnly={!editMode}
                    name="subtitle.text"
                  />
                ) : (
                  <span {...makeVisibleOn(2)}>{subtitle.text}</span>
                )}

                {/* prettier-ignore */}
                <svg viewBox="0 0 473.76 66.02" xmlns="http://www.w3.org/2000/svg"><g><path d="M470.64,0s-.06,0-.09,0C314.84,.06,159.13,.06,3.42,.06H0C1.07,.82,1.46,1.12,1.88,1.39c33.55,21.21,67.1,42.41,100.65,63.64,1.11,.71,2.22,.96,3.51,.96,118.33-.02,236.67-.03,355.01,.03h0s12.71,0,12.71,0V0h-3.12Z"/><path d="M473.76,17.01H26.62c16.87,10.66,33.73,21.33,50.6,32H473.76c-.03-10.67-.02-21.33,0-32Z" fill="#fff" fillOpacity=".2"/></g></svg>
              </div>
            </div>

            <div className="banner">
              <span {...makeVisibleOn(3)}>
                <div className="factor">
                  <h2>1. Circumstance</h2>
                  <p>{"Things we can't control"}</p>
                </div>
              </span>
              <span {...makeVisibleOn(4)}>
                <div className="factor">
                  <h2>2. Thoughts</h2>
                  <p>Are things we tell ourselves</p>
                </div>
              </span>
              <span {...makeVisibleOn(5)}>
                <div className="factor">
                  <h2>3. Feelings</h2>
                  <p>Emotions we feel</p>
                </div>
              </span>
              <span {...makeVisibleOn(6)}>
                <div className="factor">
                  <h2>4. Actions</h2>
                  <p>Plan you follow</p>
                </div>
              </span>
              <span {...makeVisibleOn(7)}>
                <div className="factor">
                  <h2>5. Results</h2>
                  <p>Are the effects of our actions</p>
                </div>
              </span>
              <span {...makeVisibleOn(8)}>
                <ul>
                  <li>
                    <strong>1. Circumstance</strong> {"Things we can't control"}
                  </li>
                  <li>
                    <strong>2. Thoughts</strong> Are things we tell ourselves
                  </li>
                  <li>
                    <strong>3. Feelings</strong> Emotions we feel
                  </li>
                  <li>
                    <strong>4. Actions</strong> Plan you follow
                  </li>
                  <li>
                    <strong>5. Results</strong> Are the effects of our actions
                  </li>
                </ul>
              </span>
            </div>

            <div className="abbreviation">
              <span>
                <span {...makeVisibleOn(9)}>C-R-A-F-T</span>
              </span>
            </div>

            <div className="main">
              <div className="col">
                <div className="block">
                  <div className="initials">
                    <span {...makeVisibleOn(10)}>T</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(10)}>Thoughts</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(12)}>Trigger</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[0][0], 1)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(11)}
                        readOnly={!editMode}
                        defaultValue={content.left.thoughts[0]}
                        name="left.thoughts[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(11)}
                        readOnly={!editMode}
                        defaultValue={content.left.thoughts[1]}
                        name="left.thoughts[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block">
                  <div className="initials">
                    <span {...makeVisibleOn(13)}>F</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(13)}>Feelings</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(15)}>Drive</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[0][1], 2)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(14)}
                        readOnly={!editMode}
                        defaultValue={content.left.feelings[0]}
                        name="left.feelings[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(14)}
                        defaultValue={content.left.feelings[1]}
                        name="left.feelings[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block">
                  <div className="initials">
                    <span {...makeVisibleOn(16)}>A</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(16)}>Actions</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(18)}>Create</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[0][2], 3)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(17)}
                        readOnly={!editMode}
                        defaultValue={content.left.actions[0]}
                        name="left.actions[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(17)}
                        readOnly={!editMode}
                        defaultValue={content.left.actions[1]}
                        name="left.actions[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block">
                  <div className="initials">
                    <span {...makeVisibleOn(19)}>R</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(19)}>Results</span>
                    </div>

                    <div className="behavior">
                      <span></span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[0][3], 4)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(20)}
                        readOnly={!editMode}
                        defaultValue={content.left.results[0]}
                        name="left.results[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(20)}
                        readOnly={!editMode}
                        defaultValue={content.left.results[1]}
                        name="left.results[1]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col middle">
                <div className="benefits">
                  <ul>
                    <li {...makeVisibleOn(21)}>Clarity</li>
                    <li {...makeVisibleOn(22)}>Confidence</li>
                    <li {...makeVisibleOn(23)}>Expertise</li>
                  </ul>
                </div>

                <div className="logo" data-html2canvas-ignore="true">
                  <Image
                    src={`/api/image/${logo}`}
                    width={logoSize}
                    height={0}
                    style={{ height: "auto" }}
                    alt=""
                    priority={true}
                    unoptimized={true}
                  />
                </div>

                {editMode && (
                  <div className="logo-size">
                    <Slider
                      step={1}
                      min={100}
                      max={200}
                      value={logoSize}
                      valueLabelDisplay="on"
                      onChange={handleSliderChange}
                    />
                  </div>
                )}
              </div>

              <div className="col">
                <div className="block flipped">
                  <div className="initials">
                    <span {...makeVisibleOn(24)}>T</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(24)}>Thoughts</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(26)}>Trigger</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[1][0], 5)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(25)}
                        readOnly={!editMode}
                        defaultValue={content.right.thoughts[0]}
                        name="right.thoughts[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(25)}
                        readOnly={!editMode}
                        defaultValue={content.right.thoughts[1]}
                        name="right.thoughts[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block flipped">
                  <div className="initials">
                    <span {...makeVisibleOn(27)}>F</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(27)}>Feelings</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(29)}>Drive</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[1][1], 6)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(28)}
                        readOnly={!editMode}
                        defaultValue={content.right.feelings[0]}
                        name="right.feelings[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(28)}
                        readOnly={!editMode}
                        defaultValue={content.right.feelings[1]}
                        name="right.feelings[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block flipped">
                  <div className="initials">
                    <span {...makeVisibleOn(30)}>A</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(30)}>Actions</span>
                    </div>

                    <div className="behavior">
                      <span {...makeVisibleOn(32)}>Create</span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[1][2], 7)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(31)}
                        readOnly={!editMode}
                        defaultValue={content.right.actions[0]}
                        name="right.actions[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(31)}
                        readOnly={!editMode}
                        defaultValue={content.right.actions[1]}
                        name="right.actions[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="block flipped">
                  <div className="initials">
                    <span {...makeVisibleOn(33)}>R</span>
                  </div>

                  <div className="top">
                    <div className="name">
                      <span {...makeVisibleOn(33)}>Results</span>
                    </div>

                    <div className="behavior">
                      <span></span>
                    </div>
                  </div>

                  <div className="bottom">
                    {superAdmin && renderAnswer(answers[1][3], 8)}

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(34)}
                        readOnly={!editMode}
                        defaultValue={content.right.results[0]}
                        name="right.results[0]"
                      />
                    </div>

                    <div className="line">
                      <input
                        type="text"
                        {...makeVisibleOn(34)}
                        readOnly={!editMode}
                        defaultValue={content.right.results[1]}
                        name="right.results[1]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!editMode && (
              <div className="controls" data-html2canvas-ignore="true">
                <button type="button" onClick={prev}>
                  <KeyboardArrowLeftIcon />
                </button>
                <button type="button" onClick={next}>
                  <KeyboardArrowRightIcon />
                </button>
                <button type="button" onClick={save}>
                  <SaveIcon />
                </button>
                <button type="button" onClick={reset}>
                  <ReplayIcon />
                </button>
                <Link href="/">
                  <HomeIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {editMode && (
        <Box mt={2} display="flex" justifyContent="space-between" width="1024px">
          {!superAdmin && (
            <Button variant="outlined" onClick={resetToDefault} disabled={isPending}>
              Reset to Defaults
            </Button>
          )}
          <Button variant="contained" type="submit" disabled={isPending}>
            Save
          </Button>
        </Box>
      )}

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  );
}

function getContrastColor(hexcolor: string): string {
  const hex = hexcolor.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 160 ? "black" : "white";
}
