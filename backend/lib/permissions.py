from rest_framework import permissions


IsAuthenticated = permissions.IsAuthenticated
IsAdminUser = permissions.IsAdminUser


class PermissionManger:
    permission_classes_by_action = {
        "default": []
    }

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            print(self.request.method.lower())
            return [
                permission()
                for permission in self.permission_classes_by_action[self.request.method.lower()]
            ]
        except KeyError:
            # action is not set return default permission_classes
            try:
                return [
                    permission()
                    for permission in self.permission_classes_by_action["default"]
                ]
            except KeyError:
                return []
