import {createLazyFileRoute} from '@tanstack/react-router'
import {useImportCsvMutation,} from '../redux/api'
import {Box} from "@mui/material";
import React, {useState} from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import green from "@mui/material/colors/green";
import {red} from '@mui/material/colors';

export const ImportView = ({}) => {
    const [importFiles, {isSuccess, isError}] = useImportCsvMutation()
    const [dragging, setDragging] = useState(false)

    const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
        evt.preventDefault()
        setDragging(false)

        const droppedFiles = Array.from(evt.dataTransfer?.files ?? []);
        const payload: string[] = []

        droppedFiles.forEach((item) => {
            const reader = new FileReader()

            reader.addEventListener("load", (evt) => {
                payload.push(evt.target?.result as string)

                if (payload.length === droppedFiles.length) {
                    importFiles(payload)
                }
            })

            reader.readAsDataURL(item)
        })
    }

    const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
        evt.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = () => {
        setDragging(false)
    }

    let bgcolor = "#fff"
    let color = "#ccc"
    let borderColor = "#ccc"

    if (dragging) {
        bgcolor = "#f1f1f1"
        color = "#000"
    } else if (isSuccess) {
        color = green[600]
        borderColor = green[600]
    } else if (isError) {
        color = red[600]
        borderColor = red[600]
    }

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            bgcolor: bgcolor,
            color: color,
            border: `5px dashed ${borderColor}`,
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 220ms ease-in-out",
            textAlign: "center"
        }}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
            <Box>
                <FileDownloadIcon sx={{fontSize: "3rem"}}/>
                <p>Upload CSV file</p>
            </Box>
        </Box>
    )
}

export const Route = createLazyFileRoute('/import')({
    component: ImportView,
})
