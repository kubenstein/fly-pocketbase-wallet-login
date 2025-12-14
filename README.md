```
docker run -it --rm -p 8090:8090 \
	-v "$(pwd)/pb/pb_data:/pb_data" \
	-v "$(pwd)/pb/pb_hooks:/pb_hooks" \
	-v "$(pwd)/pb/pb_migrations:/pb_migrations" \
	nxtgencat/pocketbase --http 0.0.0.0:8090
```
