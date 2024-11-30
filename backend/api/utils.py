def build_department_tree(departments, parent_id=0):
    tree = []
    for department in departments:
        if department["parent_dept_id"] == parent_id:
            children = build_department_tree(departments, department["department_id"])
            tree.append({
                "department_id": department["department_id"],
                "dep_name": department["dep_name"],
                "parent_dept_id": department["parent_dept_id"],
                "children": children,
            })
    return tree


def generate_org_data(departments):
    departments = list(departments.values())

    def build_tree(parent_id):
        return [
            {
                "key": str(dept["department_id"]),
                "title": dept["dep_name"],
                "children": build_tree(dept["department_id"]),
            }
            for dept in departments if dept["parent_dept_id"] == parent_id
        ]

    tree = build_tree(0)
    return tree