# trendup_back

see index.js

1. docker build -t back_image -f Dockerfile_back
2. docker run -it -p 6001:6001 --name back_container front_image /bin/bash
3. cd /exmaple/trendup_back
4. nodemon start
5. quit by X button of terminal (for working as daemon)
