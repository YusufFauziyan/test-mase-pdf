"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

// Dynamic import for PdfViewerComponent
const PdfViewerComponent = dynamic(
  () =>
    import("@syncfusion/ej2-react-pdfviewer").then(
      (mod) => mod.PdfViewerComponent
    ),
  { ssr: true }
);

const Inject = dynamic(
  () => import("@syncfusion/ej2-react-pdfviewer").then((mod) => mod.Inject),
  { ssr: false }
);

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

  const deleteAnnotations = () => {
    var viewer = document.getElementById("container").ej2_instances[0];
    viewer?.deleteAnnotations();
  };

  const handleDocumentLoad = () => {
    const viewer = document.getElementById("container").ej2_instances[0];
    const pageCount = viewer.pageCount;
    setTotalPages(pageCount);
  };

  const fetchPdf = async () => {
    try {
      const response = await fetch(URL_PDF, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dataToken.access_token}`,
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
            <IconButton size="small" onClick={() => setOpenDialog(false)}>
              <i className="ri-close-line text-2xl" />
            </IconButton>
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent sx={{ position: "relative" }}>
          <div className="control-section">
            <PdfViewerComponent
              ref={(scope) => {
                viewer = scope;
              }}
              id="container"
              documentPath={pdfBlobUrl}
              resourceUrl="https://cdn.syncfusion.com/ej2/27.2.5/dist/ej2-pdfviewer-lib"
              style={{ height: "640px", width: "100%" }}
              annotationMove={(e) =>
                setPosition({
                  x: e.currentPosition.x,
                  y: e.currentPosition.y,
                  width: e.currentPosition.width,
                  height: e.currentPosition.height,
                })
              }
              documentLoad={handleDocumentLoad}
            >
              <Inject services={["Annotation"]} />
            </PdfViewerComponent>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
