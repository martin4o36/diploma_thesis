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


def generate_chart_data(departments):
    departments = list(departments.values())
    print("Departments list:", departments)

    root_departments = [d for d in departments if d["parent_dept_id"] == 0]

    links = []
    nodes = []

    for root in root_departments:
        nodes.append({
            "id": str(root["department_id"]),
            "name": root["dep_name"],
        })

    def traverse(dept_list):
        for department in dept_list:
            if not any(node["id"] == str(department["department_id"]) for node in nodes):
                nodes.append({
                    "id": str(department["department_id"]),
                    "name": department["dep_name"],
                })
            if department["parent_dept_id"] != 0:
                links.append({
                    "from": str(department["parent_dept_id"]),
                    "to": str(department["department_id"]),
                })
            traverse(department["children"])

    for root in root_departments:
        tree = build_department_tree(departments, root["department_id"])
        traverse(tree)

        if not any(link["to"] == str(root["department_id"]) for link in links):
            links.append({"from": str(root["department_id"]), "to": str(root["department_id"])})

    print("Nodes:", nodes)
    print("Links:", links)

    return {"nodes": nodes, "links": links}