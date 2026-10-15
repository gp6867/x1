DAILY_FREE_LIMIT = 50

user_usage = {}

def check_usage(user_id, weight):

    used = user_usage.get(user_id, 0)

    if used + weight > DAILY_FREE_LIMIT:
        return False

    user_usage[user_id] = used + weight
    return True
