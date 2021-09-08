Sub NewUpload()
'
' NewUpload Macro
'

'
    'Turn off alert boxes
    Application.DisplayAlerts = False
    
    'If necessary, select Active sheet
    'Worksheets("ENTER WORKSHEET NAME HERE").Activate
    
    'Copy Jobnames column to new sheet
    Columns("C:C").Select
    Selection.Copy
    Sheets.Add After:=ActiveSheet
    Columns("A:A").Select
    ActiveSheet.Paste
    Application.CutCopyMode = False
    
    'Save New Jobname sheet to disk
    strUploadFile = "C:/sampleJobList7.txt"
    ActiveWorkbook.SaveAs Filename:=strUploadFile, FileFormat:=xlTextMSDOS, CreateBackup:=False
    ActiveSheet.Delete
    
    'Open brower (Excel likes Internet Explorer)
    Set IE = CreateObject("InternetExplorer.Application")
    IE.navigate "https://timesheets-staging.ultrenos.ca?auto=true"
    IE.Visible = True
    
    'Wait for magic MS-shell program to select file (FileUpload.vbs)
    Do While IE.Busy Or IE.readyState <> 4
        Application.Wait DateAdd("s", i, Now)
    Loop
    
    'Execute Magic MS-Shell Program To Select File
    IE.document.getElementById("job-list-input").Click
    strVBSFile = "C:\FileUpload.vbs"
    Shell "wscript.exe " & strVBSFile & " " & strUploadFile
    
    'upload file
    IE.document.getElementById("submit-job-list").Click
    
    'clean up environment
    Application.Wait DateAdd("s", 2, Now)
    Application.DisplayAlerts = True
    IE.Visible = False
End Sub
