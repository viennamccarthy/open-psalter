import json


def main():
    # Get the current psalter file
    infile = open("current_psalter.md", "r")

    # Substitute placeholders
    psalter_text = substitute_placeholders(infile.read())

    # Create list
    psalter = []

    # Split into individual psalms
    psalter_text = psalter_text.split("\n***\n")

    # For each psalm
    for psalm in psalter_text:

        # Remove title
        title_end = psalm.find("\n") + 1
        psalm = psalm.replace(psalm[0:title_end], "")

        # If multiple sections
        if "---" in psalm:
            # Create list
            psalter.append([])

            # Split into sections
            psalm = psalm.split("\n---\n")

            # For each section
            for section in psalm:
                # Create dict
                psalter[-1].append({})
                # Add to dict
                psalter_add(section, psalter[-1][-1])

        # Else (only one section)
        else:
            # Create dict
            psalter.append({})
            # Add to dict
            psalter_add(psalm, psalter[-1])

    # Close current psalter file
    infile.close()

    # Create json
    with open("../../src/data/psalter.json", "w") as outfile:
        json.dump(psalter, outfile)


def psalter_add(text, dictionary):

    # If Psalm 119
    if text.startswith("### {R") and "{H" in text:

        # Get refrain text
        refrain_end = text.find("\n")
        refrain_text = text[14:refrain_end]
        if "<b" in refrain_text:
            refrain_text = refrain_text.split("<br/>")

        # Add refrain
        dictionary["refrain"] = refrain_text

        # Create parts list
        dictionary["parts"] = []
        # Split into parts
        split_part = text.split("\n## ")
        split_part.pop(0)
        for sub_part in split_part:
            # Create dict
            dictionary["parts"].append({})
            # Add to dict
            psalter_add(sub_part, dictionary["parts"][-1])
        return

    dictionary["verses"] = []
    verses = text.split("\n")

    number = None
    for i, line in enumerate(verses):

        line = line.rstrip()

        # If verse empty
        if line == "":
            continue

        # If verse first half
        elif line[1].isdigit():
            # Get number
            n_end = line.find("}")
            number = line[1:n_end]
            dictionary["verses"].append({"n": number})
            # Get text
            line_text = line[(n_end + 1):len(line)]
            # If multiple lines, split into array
            if "--BREAK--" in line_text:
                line_text = line_text.split("--BREAK--")
            # Add line
            dictionary["verses"][-1]["vh1"] = swap_spaces(line_text)

        # Elif verse second half
        elif line.startswith("   "):
            # Get text
            line_text = line[3:len(line)]
            # If multiple lines, split into array
            if "--BREAK--" in line_text:
                line_text = line_text.split("--BREAK--")
            # Add line
            dictionary["verses"][-1]["vh2"] = swap_spaces(line_text)

        # Elif refrain
        elif line.startswith("### {R"):
            # Get refrain text
            refrain_text = line[14:len(line)]
            # If multiple lines, split into array
            if "--BREAK--" in refrain_text:
                refrain_text = refrain_text.split("--BREAK--")
            # Add refrain
            dictionary["refrain"] = swap_spaces(refrain_text)

        # Elif heading
        elif line.startswith("{H"):
            # Get heading
            heading_text = line[10:len(line)]
            # Add refrain
            dictionary["heading"] = heading_text


def substitute_placeholders(text):
    sub_text = text \
        .replace('\n\n', '\n') \
        .replace(' \\\n     ', '--BREAK--') \
        .replace(' \\\n   ', '--BREAK--') \
        .replace('O {', 'O&nbsp;{') \
        .replace(' ⁕', '&nbsp;<span class="marker">⁕</span>') \
        .replace('{def-u: ', '<span class="def-u">') \
        .replace('{def-l: ', '<span class="def-l">') \
        .replace('{voc: ', '<span class="voc">') \
        .replace('{pn-s-u: ', '<span class="pn-s-u">') \
        .replace('{pn-s-l: ', '<span class="pn-s-l">') \
        .replace('{pn-o-u: ', '<span class="pn-o-u">') \
        .replace('{pn-o-l: ', '<span class="pn-o-l">') \
        .replace('{pn-p-u: ', '<span class="pn-p-u">') \
        .replace('{pn-p-l: ', '<span class="pn-p-l">') \
        .replace('{pos: ', '<span class="pos">') \
        .replace('{pn-v-s: ', '<span class="pn-v-s">') \
        .replace('{pn-v-has: ', '<span class="pn-v-has">') \
        .replace('{pn-v-is: ', '<span class="pn-v-is">') \
        .replace('{pn-v-was: ', '<span class="pn-v-was">') \
        .replace('{pn-v-es: ', '<span class="pn-v-es">') \
        .replace('{pn-v-ies: ', '<span class="pn-v-ies">') \
        .replace('{ms-1: ', '<span class="ms-1">') \
        .replace('{ms-2: ', '<span class="ms-2">') \
        .replace('{ms-3: ', '<span class="ms-3">') \
        .replace('{ms-4: ', '<span class="ms-4">') \
        .replace('{ms-5: ', '<span class="ms-5">') \
        .replace('{kg-1: ', '<span class="kg-1">') \
        .replace('{kg-2: ', '<span class="kg-2">') \
        .replace('{kg-3: ', '<span class="kg-3">') \
        .replace('{kg-4: ', '<span class="kg-4">') \
        .replace('{kg-5: ', '<span class="kg-5">') \
        .replace('{kg-6: ', '<span class="kg-6">') \
        .replace('{kg-7: ', '<span class="kg-7">') \
        .replace('{kg-8: ', '<span class="kg-8">') \
        .replace('{kg-9: ', '<span class="kg-9">') \
        .replace('{kg-10: ', '<span class="kg-10">') \
        .replace('{kg-11: ', '<span class="kg-11">') \
        .replace(' }', '</span>')
    return sub_text


def swap_spaces(line):

    if isinstance(line, list):
        new_line = []
        for section in line:
            if "</span>" in section[-12:]:
                p = section.rfind(">", -12, -1)
                if " " in section[p:-1]:
                    index = section.rfind(" ")
                    new_section = section[:index] + "&nbsp;" + section[index + 1:]
                    new_line.append(new_section)
                else:
                    p = section.rfind("<s")
                    new_section = section[:p]
                    if new_section.endswith("&nbsp;"):
                        new_section = new_section[:-7]
                        new_line.append(swap_spaces(new_section) + section[p-7:])
                    else:
                        new_line.append(swap_spaces(new_section) + section[p:])

            elif " " in section[-12:-1]:
                if "&nb" in section and len(section) < 50:
                    new_line.append(section)
                else:
                    index = section.rfind(" ")
                    new_section = section[:index] + "&nbsp;" + section[index + 1:]
                    new_line.append(new_section)
            else:
                new_line.append(section)
        return new_line
    else:
        if "</span>" in line[-12:]:
            p = line.rfind(">", -12, -1)
            if " " in line[p:-1]:
                index = line.rfind(" ")
                new_line = line[:index] + "&nbsp;" + line[index + 1:]
                return new_line
            else:
                p = line.rfind("<s")
                new_line = line[:p]
                if new_line.endswith("&nbsp;"):
                    new_line = new_line[:-7]
                    return swap_spaces(new_line) + line[p-7:]
                else:
                    return swap_spaces(new_line) + line[p:]
        elif " " in line[-12:-1]:
            if "&nb" in line and len(line) < 50:
                return line
            else:
                index = line.rfind(" ")
                new_line = line[:index] + "&nbsp;" + line[index + 1:]
                return new_line
        else:
            return line


def swap_spaces_multispace(line):
    if isinstance(line, list):
        new_line = []
        for section in line:
            spaces = check_chars(section)
            if spaces is not None:
                new_section = section
                for index in spaces:
                    new_section = new_section[:index] + "&nbsp;" + new_section[index + 1:]
                new_line.append(new_section)
            else:
                new_line.append(section)
        return new_line
    else:
        spaces = check_chars(line)
        if spaces is not None:
            new_line = line
            for index in spaces:
                new_line = new_line[:index] + "&nbsp;" + new_line[index + 1:]
            return new_line
        else:
            return line


def check_chars(line):

    if line.endswith("⁕</span>"):
        new_line = line[:-32]
        return check_chars(new_line)
    elif "</span>" in line[-12:]:
        p = line.rfind(">", -12, -1)
        spaces = line.count(" ", p, -1)
        if spaces != 0:
            if "&nb" in line:
                spaces = 1
            elif spaces > 2:
                spaces = 2
            new_line = line
            spaces_indices = []
            for _ in range(spaces):
                index = new_line.rfind(" ", p, -1)
                spaces_indices.append(index)
                new_line = new_line[:index]
            return spaces_indices
        else:
            p = line.rfind("<s") + 1
            new_line = line[:p]
            return check_chars(new_line)
    else:
        spaces = line.count(" ", -12, -1)
        if spaces != 0:
            if "&nb" in line:
                if len(line) > 50:
                    spaces = 1
                else:
                    return None
            if spaces > 2:
                spaces = 2
            new_line = line
            spaces_indices = []
            for _ in range(spaces):
                index = new_line.rfind(" ", -12, -1)
                spaces_indices.append(index)
                new_line = new_line[:index]
            return spaces_indices
        else:
            return None


main()
