content=$(wget "https://api.github.com/repos/MRmP/stagetimerPub/releases/latest" --no-check-certificate -q -O -)
fileToDownload=$(echo $content | grep -o "browser_download_url.*.rar" | cut -d : -f 2,3 | tr -d \" | xargs)
wget -P /home/stagetimer/ $fileToDownload --no-check-certificate

unar /home/stagetimer/stagetimer.rar -f -o /home/

rm /home/stagetimer/stagetimer.rar

chmod 0765 /home/stagetimer/StageTimer

reboot
