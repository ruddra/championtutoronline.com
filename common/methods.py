
def check_login(request):
	if request.session.get("is_login"):
		return True
	return False