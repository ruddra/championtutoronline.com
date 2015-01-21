__author__ = 'Codengine'

def dec(f):
    def wrapper(obj):
        if obj.get("yes"):
            return "Hmm found inside decorator!"
        return f(obj)
    return wrapper

obj = {}


@dec
def ff(obj):
    return obj

print ff(obj)

obj["yes"] = True
print ff(obj)

obj["yes"] = False
print ff(obj)
