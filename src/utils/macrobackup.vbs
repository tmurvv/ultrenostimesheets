Sub NewUpload()
'
' NewUpload Macro
'

'
    Columns("C:C").Select
    Selection.Copy
    Sheets.Add After:=ActiveSheet
    Columns("A:A").Select
    ActiveSheet.Paste
    Application.CutCopyMode = False
    ChDir "D:\Clients\ultrenos"
    ActiveWorkbook.SaveAs Filename:="D:\Clients\ultrenos\UploadButtonExample.txt" _
        , FileFormat:=xlTextMSDOS, CreateBackup:=False
    Set IE = CreateObject("InternetExplorer.Application")
    IE.navigate "https://timesheets-staging.ultrenos.ca?auto=true"
    IE.Visible = True
    Do While IE.Busy Or IE.readyState <> 4
        Application.Wait DateAdd("s", i, Now)
    Loop
    
    strUploadFile = "D:\Clients\ultrenos\UploadButtonExample.txt"
    strVBSFile = "D:\Clients\ultrenos-fe\src\utils\FileUpload.vbs"
    Shell "wscript.exe " & strVBSFile & " " & strUploadFile
    
    IE.document.getElementById("btnAttachment").Click
    Application.Wait DateAdd("s", 2, Now)
End Sub
