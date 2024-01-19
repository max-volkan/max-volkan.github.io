import json

# Old JSON data with comments
old_json_data = [
    {
        "title": "++.290.9109.19XXXXXXXXX",
        "artist": "kaeru",
        "album": "Unknown Album",
        "cover_art": "++.290.9109.19XXXXXXXXX.jpg",
        "comment": "The title looks like kaeru's keyboard had a glitchy leap. ASCII art or a secret code?"
    },
    {
        "title": "3- \"Silent Hill Historical Society\" 4-10-2021 (Alongthewalls) *",
        "artist": "alongthewalls",
        "album": "Unknown Album",
        "cover_art": "3- Silent Hill Historical Society 4-10-2021 (Alongthewalls) .jpg",
        "comment": "Nothing says 'chill vibes' like a historical society... unless it's that Silent Hill one."
    },
    {
        "title": "4u",
        "artist": "quinn",
        "album": "Unknown Album",
        "cover_art": "4u.jpg",
        "comment": "Quinn's keeping it short and sweet with '4u', because who needs full sentences anymore?"
    },
    {
        "title": "9.9",
        "artist": "Buhduh",
        "album": "Unknown Album",
        "cover_art": "9.9.jpg",
        "comment": "Buhduh is really pushing the limits of numerical song titles. What's next, an entire math paper?"
    },
    {
        "title": "audio graffiti w/ cat mother",
        "artist": "quinn",
        "album": "Unknown Album",
        "cover_art": "audio graffiti w_ cat mother.jpg",
        "comment": "If 'audio graffiti' isn't featuring a feline DJ scratching records, I'll be disappointed."
    },
    {
        "title": "bb1scrabble",
        "artist": "chikyujin",
        "album": "Unknown Album",
        "cover_art": "bb1scrabble.jpg",
        "comment": "Chikyujin's track names are like Scrabble: points for creativity, but good luck using that in a sentence."
    },
    {
        "title": "BeatPortfolio2 [c-lips]",
        "artist": "kaeru",
        "album": "Unknown Album",
        "cover_art": "BeatPortfolio2 [c-lips].jpg",
        "comment": "Kaeru's portfolio must be hopping with tracks if this is just the 'c-lips'."
    },
    {
        "title": "dust samurai - great day [doomrmx]",
        "artist": "Vibe Selection",
        "album": "Unknown Album",
        "cover_art": "dust samurai - great day [doomrmx].jpg",
        "comment": "A 'great day' for a dust samurai... must've been a light breeze."
    },
    {
        "title": "epitome",
        "artist": "downstem",
        "album": "Unknown Album",
        "cover_art": "epitome.jpg",
        "comment": "The 'epitome' of music? Downstem's setting that bar sky-high."
    },
    {
        "title": "fent and all (SP202 throw away)",
        "artist": "ethanbar?",
        "album": "Unknown Album",
        "cover_art": "fent and all (SP202 throw away).jpg",
        "comment": "Ethanbar? tossing tracks like they're expired prescriptions."
    },
    {
        "title": "friday",
        "artist": "blaine",
        "album": "Unknown Album",
        "cover_art": "friday.jpg",
        "comment": "Ah, 'friday' by Blaine, because every other day was just too mainstream."
    },
    {
        "title": "Getminez",
        "artist": "IndescribableINDY",
        "album": "Unknown Album",
        "cover_art": "Getminez.jpg",
        "comment": "IndescribableINDY's 'Getminez' – because sharing is overrated."
    },
    {
        "title": "hauntme",
        "artist": "slowly, slowly",
        "album": "Unknown Album",
        "cover_art": "hauntme.jpg",
        "comment": "'Hauntme' by Slowly, Slowly – for those moments when you can't shake off that awkward thing you said 3 years ago."

    },
    {
        "title": "in the night",
        "artist": "lovue",
        "album": "Unknown Album",
        "cover_art": "in the night.jpg",
        "comment": "Lovue's 'in the night'—for all those who thought twilight was just too bright."
    },
    {
        "title": "metgaler throwaway",
        "artist": "aNTOJE",
        "album": "Unknown Album",
        "cover_art": "metgaler throwaway.jpg",
        "comment": "Metgaler throwaway? Ah, aNTOJE, so humble, even the Met's scraps are masterpieces."
    },
    {
        "title": "mintFlow",
        "artist": "BACKFACE CULLING",
        "album": "Unknown Album",
        "cover_art": "mintFlow.jpg",
        "comment": "Refreshing and cool, or just another 'mintFlow' in the data stream?"
    },
    {
        "title": "mirth",
        "artist": "Duro",
        "album": "Unknown Album",
        "cover_art": "mirth.jpg",
        "comment": "Mirth by Duro: when joy meets a beat and decides to stay awhile."
    },
    {
        "title": "nathan b",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "nathan b.jpg",
        "comment": "Maxp3's 'nathan b'—the musical equivalent of 'Guess who?'"
    },
    {
        "title": "Neon Nights (soulbop throw away)",
        "artist": "ethanbar?",
        "album": "Unknown Album",
        "cover_art": "Neon Nights (soulbop throw away).jpg",
        "comment": "Ethanbar? throws away neon nights like they're going out of style. Wait, are they?"
    },
    {
        "title": "outnabout",
        "artist": "Buhduh",
        "album": "Unknown Album",
        "cover_art": "outnabout.jpg",
        "comment": "Buhduh is 'outnabout', probably searching for the rest of the song title."
    },
    {
        "title": "pentel",
        "artist": "am04",
        "album": "Unknown Album",
        "cover_art": "pentel.jpg",
        "comment": "Pentel, huh? am04, channeling stationery vibes for that crisp, paper-like audio texture."
    },
    {
        "title": "retha & musket",
        "artist": "retha",
        "album": "Unknown Album",
        "cover_art": "retha & musket.jpg",
        "comment": "Retha bringing muskets to a beat battle. Talk about heavy artillery!"
    },
    {
        "title": "scrap(probably)2",
        "artist": "chikyujin",
        "album": "Unknown Album",
        "cover_art": "scrap(probably)2.jpg",
        "comment": "With a name like 'scrap(probably)2', chikyujin's recycling bin must be a treasure trove."
    },
    {
        "title": "slowly, but surely",
        "artist": "downstem",
        "album": "Unknown Album",
        "cover_art": "slowly, but surely.jpg",
        "comment": "Downstem's taking their sweet time with 'slowly, but surely'. Hopefully, the track ends before we're all retired."
    },
    {
        "title": "Strawberry Drums",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "Strawberry Drums.jpg",
        "comment": "Maxp3's 'Strawberry Drums' sounds deliciously rhythmic. Just don't try to jam with actual fruit."
    },
    {
        "title": "termination w orenji soul.",
        "artist": "meezow",
        "album": "Unknown Album",
        "cover_art": "termination w orenji soul..jpg",
        "comment": "Meezow's 'termination w orenji soul.' gives a whole new meaning to 'soul-crushing'."
    },
    {
        "title": "THRUYASYSTEM!!!!!!",
        "artist": "meezow",
        "album": "Unknown Album",
        "cover_art": "THRUYASYSTEM!!!!!!.jpg",
        "comment": "Meezow's caps lock is stuck on 'THRUYASYSTEM!!!!!!'—subtlety is clearly overrated."
    },
    {
        "title": "untitled6",
        "artist": "Duro",
        "album": "Unknown Album",
        "cover_art": "untitled6.jpg",
        "comment": "Duro's 'untitled6' – when titles are overrated, but the track isn't."
    }
]

# New JSON data without comments
new_json_data = [
    {
        "title": "++.290.9109.19XXXXXXXXX",
        "artist": "kaeru",
        "album": "Unknown Album",
        "cover_art": "++.290.9109.19XXXXXXXXX.jpg",
        "comment": ""
    },
    {
        "title": "3- \"Silent Hill Historical Society\" 4-10-2021 (Alongthewalls) *",
        "artist": "alongthewalls",
        "album": "Unknown Album",
        "cover_art": "3- Silent Hill Historical Society 4-10-2021 (Alongthewalls) .jpg",
        "comment": ""
    },
    {
        "title": "4u",
        "artist": "quinn",
        "album": "Unknown Album",
        "cover_art": "4u.jpg",
        "comment": ""
    },
    {
        "title": "9.9",
        "artist": "Buhduh",
        "album": "Unknown Album",
        "cover_art": "9.9.jpg",
        "comment": ""
    },
    {
        "title": "aj theory",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "aj theory.jpg",
        "comment": ""
    },
    {
        "title": "audio graffiti w/ cat mother",
        "artist": "quinn",
        "album": "Unknown Album",
        "cover_art": "audio graffiti w_ cat mother.jpg",
        "comment": ""
    },
    {
        "title": "basset hound, again",
        "artist": "corpsewax",
        "album": "Unknown Album",
        "cover_art": "basset hound, again.jpg",
        "comment": ""
    },
    {
        "title": "bb1scrabble",
        "artist": "chikyujin",
        "album": "Unknown Album",
        "cover_art": "bb1scrabble.jpg",
        "comment": ""
    },
    {
        "title": "BeatPortfolio2 [c-lips]",
        "artist": "kaeru",
        "album": "Unknown Album",
        "cover_art": "BeatPortfolio2 [c-lips].jpg",
        "comment": ""
    },
    {
        "title": "diseperse",
        "artist": "inspectah_k",
        "album": "Unknown Album",
        "cover_art": "diseperse.jpg",
        "comment": ""
    },
    {
        "title": "dust samurai - great day [doomrmx]",
        "artist": "Vibe Selection",
        "album": "Unknown Album",
        "cover_art": "dust samurai - great day [doomrmx].jpg",
        "comment": ""
    },
    {
        "title": "epitome",
        "artist": "downstem",
        "album": "Unknown Album",
        "cover_art": "epitome.jpg",
        "comment": ""
    },
    {
        "title": "fent and all (SP202 throw away)",
        "artist": "ethanbar?",
        "album": "Unknown Album",
        "cover_art": "fent and all (SP202 throw away).jpg",
        "comment": ""
    },
    {
        "title": "friday",
        "artist": "blaine",
        "album": "Unknown Album",
        "cover_art": "friday.jpg",
        "comment": ""
    },
    {
        "title": "Getminez",
        "artist": "IndescribableINDY",
        "album": "Unknown Album",
        "cover_art": "Getminez.jpg",
        "comment": ""
    },
    {
        "title": "hauntme",
        "artist": "slowly, slowly",
        "album": "Unknown Album",
        "cover_art": "hauntme.jpg",
        "comment": ""
    },
    {
        "title": "in the night",
        "artist": "lovue",
        "album": "Unknown Album",
        "cover_art": "in the night.jpg",
        "comment": ""
    },
    {
        "title": "judybaileyflip",
        "artist": "vcbf101",
        "album": "Unknown Album",
        "cover_art": "judybaileyflip.jpg",
        "comment": ""
    },
    {
        "title": "kogda tebe huevo rmx",
        "artist": "R0Rcon4 RAS00L ACBH",
        "album": "Unknown Album",
        "cover_art": "kogda tebe huevo rmx.jpg",
        "comment": ""
    },
    {
        "title": "maxp3 uses anri kit",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "maxp3 uses anri kit.jpg",
        "comment": ""
    },
    {
        "title": "metgaler throwaway",
        "artist": "aNTOJE",
        "album": "Unknown Album",
        "cover_art": "metgaler throwaway.jpg",
        "comment": ""
    },
    {
        "title": "mintFlow",
        "artist": "BACKFACE CULLING",
        "album": "Unknown Album",
        "cover_art": "mintFlow.jpg",
        "comment": ""
    },
    {
        "title": "mirth",
        "artist": "Duro",
        "album": "Unknown Album",
        "cover_art": "mirth.jpg",
        "comment": ""
    },
    {
        "title": "nathan b",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "nathan b.jpg",
        "comment": ""
    },
    {
        "title": "Neon Nights (soulbop throw away)",
        "artist": "ethanbar?",
        "album": "Unknown Album",
        "cover_art": "Neon Nights (soulbop throw away).jpg",
        "comment": ""
    },
    {
        "title": "neuralinked",
        "artist": "neura",
        "album": "Unknown Album",
        "cover_art": "neuralinked.jpg",
        "comment": ""
    },
    {
        "title": "outnabout",
        "artist": "Buhduh",
        "album": "Unknown Album",
        "cover_art": "outnabout.jpg",
        "comment": ""
    },
    {
        "title": "pentel",
        "artist": "am04",
        "album": "Unknown Album",
        "cover_art": "pentel.jpg",
        "comment": ""
    },
    {
        "title": "retha & musket",
        "artist": "retha",
        "album": "Unknown Album",
        "cover_art": "retha & musket.jpg",
        "comment": ""
    },
    {
        "title": "sameyt3fhg",
        "artist": "anri",
        "album": "Unknown Album",
        "cover_art": "sameyt3fhg.jpg",
        "comment": ""
    },
    {
        "title": "scrap(probably)2",
        "artist": "chikyujin",
        "album": "Unknown Album",
        "cover_art": "scrap(probably)2.jpg",
        "comment": ""
    },
    {
        "title": "silent slasj",
        "artist": "ahemcell",
        "album": "Unknown Album",
        "cover_art": "silent slasj.jpg",
        "comment": ""
    },
    {
        "title": "slowly, but surely",
        "artist": "downstem",
        "album": "Unknown Album",
        "cover_art": "slowly, but surely.jpg",
        "comment": ""
    },
    {
        "title": "stinky feets",
        "artist": "pendrag1_",
        "album": "Unknown Album",
        "cover_art": "stinky feets.jpg",
        "comment": ""
    },
    {
        "title": "Strawberry Drums",
        "artist": "maxp3",
        "album": "Unknown Album",
        "cover_art": "Strawberry Drums.jpg",
        "comment": ""
    },
    {
        "title": "termination w orenji soul.",
        "artist": "meezow",
        "album": "Unknown Album",
        "cover_art": "termination w orenji soul..jpg",
        "comment": ""
    },
    {
        "title": "THRUYASYSTEM!!!!!!",
        "artist": "meezow",
        "album": "Unknown Album",
        "cover_art": "THRUYASYSTEM!!!!!!.jpg",
        "comment": ""
    },
    {
        "title": "untitled6",
        "artist": "Duro",
        "album": "Unknown Album",
        "cover_art": "untitled6.jpg",
        "comment": ""
    },
    {
        "title": "WASTEMIX 1",
        "artist": "wastemen",
        "album": "Unknown Album",
        "cover_art": "WASTEMIX 1.jpg",
        "comment": ""
    },
    {
        "title": "????????? ????? ????",
        "artist": "jetson",
        "album": "Unknown Album",
        "cover_art": "\u3164\u3164\ud835\udc13\ud835\udc07\ud835\udc11\ud835\udc0e\ud835\udc16\ud835\udc04\ud835\udc03 \ud835\udc13\ud835\udc00\ud835\udc0f\ud835\udc04\ud835\udc12 \u3299\ufe0f\u3164\u3164.jpg",
        "comment": ""
    }
]

# Create a dictionary to store comments by title
comment_dict = {item["title"]: item["comment"] for item in old_json_data}

# Merge old comments with new data
for item in new_json_data:
    title = item["title"]
    if title in comment_dict:
        item["comment"] = comment_dict[title]

# The new_json_data now contains the restored comments
# You can save it to a file or use it as needed
print(json.dumps(new_json_data, indent=4))