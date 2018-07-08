# To make binary even smaller
# Install 'upx' at https://upx.github.io/
# If homebrew (Mac OS only) is locally installed you could run
# 'brew install upx'
# and run 'upx --brute messaging'
messaging:
	GOOS=linux go build -ldflags="-s -w"

.PHONY: clean
clean:
	go clean
	