"use client";

import { useEffect, useState } from "react";

import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  PageOrganizer,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import "./pdf.css";
import { useGetToken } from "@/utils/files-api";

const URL_PDF =
  "https://cors.bodha.co.id/http://10.1.111.141:30155/api/v2/user/files?path=/PEMBANGUNAN%20JALAN%20TOL%20BANDARA%20DHOHO%20KEDIRI/PPC/WEEKLY%20REPORT/TST-TSTDSP_AL-IS-500%2B500-TAHU-0001/R0/TST-TSTDSP_AL-IS-500%2B500-TAHU-0001%20TERBAU.pdf";

export default function Home() {
  let viewer;

  const { data: dataToken, refetch: getToken } = useGetToken(false, {
    username: "devdocon",
    password: "devdocon",
  });

  const [openDialog, setOpenDialog] = useState(false);

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [totalPages, setTotalPages] = useState(0);

  // function
  const deleteAnnotations = () => {
    var viewer = document.getElementById("container").ej2_instances[0];

    viewer?.deleteAnnotations();
  };

  const handleDocumentLoad = () => {
    const viewer = document.getElementById("container").ej2_instances[0];
    const pageCount = viewer.pageCount;

    setTotalPages(pageCount); // Update state with total page count
    console.log("Total Pages:", pageCount);
  };

  const handleResize = (e) => {
    setPosition({
      x: e.annotationBound.x,
      y: e.annotationBound.y,
      width: e.annotationBound.width,
      height: e.annotationBound.height,
      top: e.annotationBound.top,
      left: e.annotationBound.left,
    });
  };

  const handleMove = (e) => {
    setPosition({
      x: e.currentPosition.x,
      y: e.currentPosition.y,
      width: e.currentPosition.width,
      height: e.currentPosition.height,
      top: e.currentPosition.top,
      left: e.currentPosition.left,
    });
  };

  function downloadClicked() {
    var viewer = document.getElementById("container").ej2_instances[0];

    console.log(viewer);

    viewer?.download();
  }

  const stampsAllPage = () => {
    var viewer = document.getElementById("container").ej2_instances[0];

    deleteAnnotations();

    for (let i = 1; i <= totalPages; i++) {
      viewer.annotation.addAnnotation("Stamp", {
        offset: { x: position?.x, y: position?.y },
        width: position?.width,
        author: "Guest",
        height: position?.height,
        top: position?.top,
        left: position?.left,
        pageNumber: i,
        customStamps: [
          {
            customStampName: "Image",
            // customStampImageSource: convertedImage,
          },
        ],
      });
    }
  };

  useEffect(() => {
    // Menambahkan link CSS Bootstrap ke DOM
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.syncfusion.com/ej2/28.1.33/bootstrap5.css";
    document.head.appendChild(link);

    // Membersihkan link saat komponen dilepas
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const fetchPdf = async () => {
    try {
      const response = await fetch(URL_PDF, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dataToken.access_token}`, // Replace with your token
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setPdfBlobUrl(blobUrl);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (dataToken?.access_token) {
      fetchPdf();
    }
  }, [dataToken]);

  useEffect(() => {
    const textToFind1 =
      "This application was built using a trial version of Syncfusion Essential Studio. To remove the license validation message permanently, a valid license key must be included.";

    const textToFind =
      "Claim your FREE account and get a key in less than a minute";

    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll("*");

      elements.forEach((element) => {
        if (element.textContent === textToFind1) {
          const parentElement = element.parentElement;
          if (parentElement) {
            parentElement.style.display = "none";
          }
        }

        if (element.textContent === textToFind) {
          const parentElement = element.parentElement;
          const grandParentElement = parentElement?.parentElement;
          if (grandParentElement) {
            grandParentElement.style.display = "none";
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewer = document.getElementById("container").ej2_instances?.[0];
    if (viewer) {
      viewer.refresh(); // Refresh ukuran setelah mount
    }
  }, []);

  return (
    <div className="h-[100vh] flex item-center flex-col justify-center">
      <div className="flex item-center justify-center">
        <button
          className="border rounded-lg px-4 py-2"
          onClick={() => setOpenDialog(true)}
        >
          Open Modal
        </button>
      </div>

      <PdfViewerComponent
        ref={(scope) => {
          viewer = scope;
        }}
        id="container"
        documentPath="https://cors.bodha.co.id/https://dev-ims.bodha.co.id/api/files/x14gj7rvq6ty3mg/vcvb9tv5i2hoxov/da448064_6266_4e9f_948b_8096eb44e64a_5LeDlofiLY.pdf?token="
        resourceUrl="https://cdn.syncfusion.com/ej2/23.2.6/dist/ej2-pdfviewer-lib"
        style={{ height: "640px" }}
      >
        <Inject
          services={[
            Toolbar,
            Magnification,
            Navigation,
            LinkAnnotation,
            BookmarkView,
            ThumbnailView,
            Print,
            TextSelection,
            TextSearch,
            Annotation,
            FormFields,
            FormDesigner,
            PageOrganizer,
          ]}
        />
      </PdfViewerComponent>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="grid gap-3">
          <div className="flex justify-between items-center">
            <Typography fontSize={24} className="font-semibold">
              Stamp Document
            </Typography>

            <IconButton size="small" onClick={setOpenDialog}>
              <i className="ri-close-line text-2xl" />
            </IconButton>
          </div>

          <Divider />
        </DialogTitle>
        <DialogContent sx={{ position: "relative" }}>
          {/* Render the PDF Viewer */}
          <div className="control-section">
            <PdfViewerComponent
              ref={(scope) => {
                viewer = scope;
              }}
              id="container"
              documentPath={pdfBlobUrl}
              resourceUrl="https://cdn.syncfusion.com/ej2/27.2.5/dist/ej2-pdfviewer-lib"
              style={{ height: "640px", width: "100%" }}
              annotationMove={handleMove}
              annotationResize={handleResize}
              documentLoad={handleDocumentLoad}
              initialRenderPages={50}
            >
              <Inject services={[Annotation]} />
            </PdfViewerComponent>
          </div>
        </DialogContent>

        <DialogActions className="flex justify-between items-center mt-5">
          <div className="flex">
            <Button variant="outlined" color="primary" onClick={stampsAllPage}>
              Stamps All Page
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
              color="error"
            >
              Cancel
            </Button>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              className="text-white"
              // onClick={downloadClicked}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const resetGantt = () => {
  const textToFind =
    "Claim your FREE account and get a key in less than a minute";

  const textToFind1 =
    "This application was built using a trial version of Syncfusion Essential Studio. To remove the license validation message permanently, a valid license key must be included.";

  const elements = document.querySelectorAll("*"); // Select all elements in the DOM

  elements.forEach((element) => {
    if (element.textContent === textToFind1) {
      const parentElement = element.parentElement; // Get the parent element

      if (parentElement) {
        parentElement.style.display = "none"; // Hide the parent element
      }
    }

    if (element.textContent === textToFind) {
      const parentElement = element.parentElement; // Get the parent element
      const grandParentElement = parentElement.parentElement; // Get the grandparent element

      if (grandParentElement) {
        grandParentElement.style.display = "none"; // Hide the parent element
      }
    }
  });
};
