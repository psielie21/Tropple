#!/bin/bash

for filename in ./assets/*.svg; do
	echo "$filename" >> filenames.txt
done

