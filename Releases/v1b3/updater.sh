cd /home/stagetimer && { curl "https://api.github.com/repos/MRmP/stagetimer/releases/latest" |
    grep '"tag_name":' |                                                 
    sed -E 's/.*"([^"]+)".*/\1/' |
    xargs -I {} curl -sOL "https://github.com/MRmP/stagetimer/releases/download/"{}'/stagetimer.rar'; }

unar /home/stagetimer/stagetimer.rar -f -o /home/

rm /home/stagetimer/stagetimer.rar

chmod 0765 /home/stagetimer/StageTimer

reboot
