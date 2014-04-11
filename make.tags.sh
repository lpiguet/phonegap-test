rm -f TAGS; find .  \( -name '*.php' -o -name '*.ctp' -o -name '*.js'  -o -name '*.html' \) -exec etags -a -o TAGS {} \;


