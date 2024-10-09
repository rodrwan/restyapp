getLocalIp:
	@ifconfig | grep inet | sed -n '5p' | awk '{print $$2}'

build:
	@npx expo run:ios --no-build-cache

start:
	@npx expo start -c

PHONY: getLocalIp