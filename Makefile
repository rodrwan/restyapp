getLocalIp:
	@ifconfig | grep inet | sed -n '5p' | awk '{print $$2}'

PHONY: getLocalIp