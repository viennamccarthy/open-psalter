####################################################
#                                                  #
#            TO OBTAIN SOURCE .ICS FILE            #
#            --------------------------            #
#                                                  #
#           Select "iCal download" from:           #
#                                                  #
#            https://almanac.oremus.org            #
#                 ("Downloads" tab)                #
#                                                  #
#       with the following options selected:       #
#                                                  #
#    ------------------------------------------    #
#     Lectionaries:                                #
#     - Principal, Second and Third Services       #
#     - Weekday Office Lectionary                  #
#                                                  #
#     Collects:                                    #
#     - None                                       #
#                                                  #
#     Other options:                               #
#     - None                                       #
#    ------------------------------------------    #
#                                                  #
#      "almanac_YYYY.ics" must be in the same      #
#             directory as this script             #
#                                                  #
#                                                  #
#        N.B. THIS SCRIPT OUTPUTS TWO FILES:       #
#       lectionary.json AND manual_entry.json.     #
#         THE LATTER CONTAINS TRANSFERRABLE        #
#       FEASTS THAT MUST BE ENTERED MANUALLY,      #
#            MAKING USE OF PAIRS WITHIN            #
#                `"transferred": {}`               #
#                                                  #
####################################################

# NB check the "single" verses, sometimes these are just due to weird formatting in the .ics file

import json
import re


def main():
    # Get the lectionary txt file
    infile = open("almanac-2024.ics", "r")
    lectionary_file = infile.read().replace("\n ", "")

    days = lectionary_file.split("\nEND:VEVENT\nBEGIN:VEVENT\n")
    days.pop(0)
    days.pop(-1)

    lectionary = {}
    manual_entry = []

    for day in days:
        enter_day(day, lectionary, manual_entry)

    infile.close()

    # Write lectionary JSON
    with open("lectionary.json", "w") as lectionary_out:
        json.dump(lectionary, lectionary_out)

    # Write manual entry JSON
    with open("manual_entry.json", "w") as manual_out:
        json.dump(manual_entry, manual_out)

    return


def enter_day(day, lectionary, manual_entry):

    lines = day.splitlines()

    # Get rid of unnecessary days
    if ("Ember Day" in lines[5]
            or "Mothering Sunday" in lines[5]
            or "Easter Vigil" in lines[5]
            or "Rogation Day" in lines[5]
            or "Almanac" in lines[5]):
        return

    # Create details list
    details = lines[5]
    for line in lines[6:]:
        details = details + line.lstrip()

    # Move certain days to manual
    if ("If the Epiphany" in details
            or "if the Epiphany" in details
            or "If the Presentation" in details
            or "if the Presentation" in details
            or "All Saints" in details
            or "Michael and" in details
            or "Corpus Christi" in details
            or details == "\nDESCRIPTION:"):
        # manual
        manual_entry.append(day)
        return

    # Insert new date into lectionary and create dicts
    date = lines[0][-8:]

    if date in lectionary:
        date_dict = lectionary[date]
        morning_dict = check_dict(date_dict, "morning")
        evening_dict = check_dict(date_dict, "evening")
    else:
        lectionary[date] = {"morning": [{}], "evening": [{}]}
        date_dict = lectionary[date]
        morning_dict = date_dict["morning"][0]
        evening_dict = date_dict["evening"][0]

    # Insert feast information into lectionary
    if lines[4][8:11] == "CW*":
        rld = lines[4][12:].replace("(or) ", "")
        if "; " in rld:
            multi_rld = rld.split("; ")
            feast = None
            for j, part in enumerate(multi_rld):
                if j == 0 or 'Remembrance' in part:
                    multi_rld[j] = comma_search(part)
                else:
                    feast = comma_search(part)
                    multi_rld.pop(j)

            if len(multi_rld) == 1:
                morning_dict["redLetter"] = multi_rld[0]
                evening_dict["redLetter"] = multi_rld[0]
            else:
                morning_dict["redLetter"] = multi_rld
                evening_dict["redLetter"] = multi_rld
            if feast:
                morning_dict["feast"] = feast
                evening_dict["feast"] = feast
        else:
            morning_dict["redLetter"] = rld
            evening_dict["redLetter"] = rld
    elif len(lines[4]) > 13:
        feast_day = lines[4][11:]
        if "; " in feast_day:
            multi_feast = feast_day.split("; ")
            for j, part in enumerate(multi_feast):
                multi_feast[j] = comma_search(part)
            morning_dict["feast"] = multi_feast
            evening_dict["feast"] = multi_feast
        else:
            morning_dict["feast"] = comma_search(feast_day)
            evening_dict["feast"] = comma_search(feast_day)

    # Get morning prayer from details list
    if "Holy Week" in details or "Maundy Thursday" in details or "Good Friday" in details or "Easter Eve" in details:
        # Split at \\nMorning\\n, discard first part
        details = details.split("\\nMorning\\n")
        details = details[1]
    elif "Third Service" in details:
        # split at Third Service\\n and discard first part
        details = details.split("Third Service\\n")
        details = details[1]
    elif "Morning Prayer" in details:
        # split at \\nMorning Prayer, discard first part
        details = details.split("Morning Prayer")
        details = details[1]

    # Get evening prayer from details list
    updated_rld = None

    if "\\nEvening\\n" in details:
        # Split at \\nEvening\\n
        details = details.split("\\nEvening\\n")
    elif "\\nSecond Service\\n" in details:
        # split at \\n\\nSecond Service\\n
        details = details.split("\\nSecond Service\\n")
    elif "\\nEvening Prayer of " in details:
        # split at "\\nEvening Prayer of "
        details = details.split("\\nEvening Prayer of ")
    elif "\\nEvening Prayer\\n" in details:
        # split at "\\nEvening Prayer\\n"
        details = details.split("\\nEvening Prayer\\n")
    elif "\\nEvening Prayer on " in details:
        # split at "\\nEvening Prayer on "
        details = details.split("\\nEvening Prayer on ")
        updated_rld = details[1].split("\\n")
        if "feast" in evening_dict:
            del evening_dict["feast"]

    # Enter MP into lectionary
    enter_office(date_dict, "morning", details[0])

    # Check if alternate EP
    if "Evening Prayer on" in details[1]:

        # Split EPs and enter each into lectionary
        details[1] = details[1].split("Evening Prayer on ")
        for i, option in enumerate(details[1]):
            if i == 0:
                enter_office(date_dict, "evening", option)
            else:
                enter_office(date_dict, "evening", option)
                updated_rld = option.replace(" (if required)", "").split("\\n")
                date_dict["evening"][-1]["redLetter"] = updated_rld[0][0].upper() + updated_rld[0][1:]
    else:

        # Enter EP into lectionary
        enter_office(date_dict, "evening", details[1])
        if updated_rld:
            date_dict["evening"][-1]["redLetter"] = updated_rld[0][0].upper() + updated_rld[0][1:]


    # Set default morning and evening prayer
    set_default(date_dict["morning"])
    set_default(date_dict["evening"])

    return


def enter_office(date_dict, office, details):

    if isinstance(details, list):
        for item in details:
            office_dict = check_dict(date_dict, office)
            split_item = item.split("\\n")

            if "Eve" in split_item[0]:
                office_dict["redLetter"] = split_item[0]
                split_item.pop(0)

            for line in split_item:
                find_psalms(office_dict, line)
    else:
        office_dict = check_dict(date_dict, office)
        details = details.split("\\n")
        for line in details:
            find_psalms(office_dict, line)

    return


def find_psalms(office_dict, line_to_search):

    if not line_to_search.startswith("Psa"):
        return

    line = line_to_search.replace("\\", "").replace(";", ",")

    # if alternate psalm sets provided
    if "or" in line:

        # get exact "or" (lmao)
        if "(or)" in line:
            if "(or " in line:
                split_line = line.split(" (or")
                for index, section in enumerate(split_line):
                    if section[0] == ")":
                        split_line[index] = section[2:]
                if split_line[-1][-1] == ")":
                    split_line[-1] = split_line[-1][:-1]
            else:
                split_line = line.split(" (or) ")
        elif "(or " in line:
            split_line = line.split(" (or ")
            if split_line[-1][-1] == ")":
                split_line[-1] = split_line[-1][:-1]
        elif "or" in line:
            split_line = line.split(" or ")

        for index, section in enumerate(split_line):
            office_dict[f"psalms{index}"] = []

            if index == 0:
                find_psalms(office_dict, section)
            else:
                if ", " in section:
                    prepended_section = "Psalms " + section
                else:
                    prepended_section = "Psalm " + section
                find_psalms(office_dict, prepended_section)
        return

    # If only one set provided
    else:

        # Get or create psalms list (i.e. check if list already exists due to recursive run)
        if "psalms2" in office_dict:
            psalms_list = office_dict["psalms2"]
        elif "psalms1" in office_dict:
            psalms_list = office_dict["psalms1"]
        elif "psalms0" in office_dict:
            psalms_list = office_dict["psalms0"]
        else:
            office_dict["psalms"] = []
            psalms_list = office_dict["psalms"]

        if line.startswith("Psalms"):
            psalm = line.replace("Psalms ", "")
            if ", " in psalm:
                psalms_to_input = psalm.split(", ")
                for single_psalm in psalms_to_input:
                    enter_single_psalm(psalms_list, single_psalm)
            else:
                enter_single_psalm(psalms_list, psalm)
        elif line.startswith("Psalm"):
            psalm = line.replace("Psalm ", "")
            enter_single_psalm(psalms_list, psalm)
    return


def enter_single_psalm(psalms_list, number):

    # Check if optional and set correctly
    optional = False
    if number[0] == "(":
        number = number.replace("(", "").replace(")", "")
        optional = True
    elif number[0] == "[":
        closing_index = number.rfind("]") - 1
        number = number[1:closing_index]
        optional = True
    elif "[" in number:
        if "." in number:
            psalms_list.append({})
            psalms_dict = psalms_list[-1]
            split_number = number.split(".")
            psalms_dict["number"] = int(split_number[0])
            psalms_dict["verses"] = []
            if split_number[1][0] == "[":
                split_number[1] = split_number[1][1:].split("]")
                process_verses(split_number[1][0], psalms_dict["verses"], True)
                process_verses(split_number[1][1], psalms_dict["verses"], False)
                return
            else:
                split_number[1] = split_number[1].split("[")
                process_verses(split_number[1][0], psalms_dict["verses"], False)
                split_number[1][1] = split_number[1][1].replace("]", "")
                process_verses(split_number[1][1], psalms_dict["verses"], True)
                return
        elif number[-1] == "]":
            split_number = number.split("[")
            enter_single_psalm(psalms_list, split_number[0])
            enter_single_psalm(psalms_list, split_number[1])
            return
    elif number[-1] == "]":
        number = number.replace("]", "")
        optional = True

    # Create psalm dict
    psalms_list.append({})
    single_psalm_dict = psalms_list[-1]

    # Enter psalm into psalm dict
    if "." in number:
        split_number = number.split(".")
        single_psalm_dict["number"] = int(split_number[0])
        single_psalm_dict["verses"] = []
        verses_list = single_psalm_dict["verses"]
        process_verses(split_number[1], verses_list, optional)
    elif "*" in number:
        number = number.replace("*", "")
        single_psalm_dict["number"] = int(number)
        single_psalm_dict["canShorten"] = True
    else:
        single_psalm_dict["number"] = int(number)

    # If optional, set as optional
    if optional:
        single_psalm_dict["optional"] = True

    return


def process_verses(verses, verses_list, optional):

    if ", " in verses:
        verses = verses.split(", ")
        for verse in verses:
            process_verses(verse, verses_list, False)
        return
    elif "-" in verses:
        verses_list.append({})
        verses_dict = verses_list[-1]
        if optional:
            verses_dict["optional"] = True
        if "*" in verses:
            verses = verses.replace("*", "")
            verses_dict["canShorten"] = True
        verses = verses.split("-")
        verses_dict["start"] = int(verses[0])
        if verses[1] == "end":
            verses_dict["end"] = 490
        else:
            verses_dict["end"] = int(verses[1])
    else:
        verses_list.append({})
        verses_dict = verses_list[-1]
        if optional:
            verses_dict["optional"] = True
        verses_dict["single"] = int(verses)
    return


def check_dict(date_dict, office):

    if office in date_dict:
        if len(date_dict[office]) == 1 and "psalms" in date_dict[office][0] or "psalms0" in date_dict[office][0]:
            date_dict[office].append({})
        elif len(date_dict[office]) > 1 or len(date_dict[office]) == 0:
            date_dict[office].append({})
    else:
        date_dict[office] = [{}]
    return date_dict[office][-1]


def comma_search(string):

    comma = re.search(", [c,\\d]", string)

    if comma is not None:
        return string[:comma.start()]
    else:
        return string


def set_default(office_list):

    if len(office_list) == 1:
        return

    has_eve = False

    for option in office_list:
        if "default" in option:
            del option["default"]
        if "redLetter" in option and "Eve of" in option["redLetter"]:
            has_eve = True

    if not has_eve:
        office_list[0]["default"] = True
    else:
        for option in office_list:
            if "redLetter" in option and "Eve of" in option["redLetter"]:
                option["default"] = True
                return

    return


main()
