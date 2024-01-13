import os
import json
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, error



def extract_metadata(file_path, cover_art_dir):
    audio = MP3(file_path, ID3=ID3)

    metadata = {
        'title': str(audio.get('TIT2', 'Unknown Title')),
        'artist': str(audio.get('TPE1', 'Unknown Artist')),
        'album': str(audio.get('TALB', 'Unknown Album')),
        'cover_art': None
    }

    if audio.tags is not None:
        for tag in audio.tags.values():
            if isinstance(tag, APIC):
                cover_art_filename = f"{os.path.splitext(os.path.basename(file_path))[0]}.jpg"
                cover_art_path = os.path.join(cover_art_dir, cover_art_filename)
                with open(cover_art_path, 'wb') as img_file:
                    img_file.write(tag.data)
                metadata['cover_art'] = cover_art_filename
                break

    return metadata

def main():
    directory = 'C:/Users/mtvol/Desktop/sunlit web/max-volkan.github.io/radio-song-crate-1'
    all_metadata = []
    cover_art_dir = os.path.join(directory, 'cover_arts')
    if not os.path.exists(cover_art_dir):
        os.makedirs(cover_art_dir)

    for filename in os.listdir(directory):
        if filename.endswith('.mp3'):
            file_path = os.path.join(directory, filename)
            metadata = extract_metadata(file_path, cover_art_dir)
            all_metadata.append(metadata)

    with open('metadata.json', 'w') as f:
        json.dump(all_metadata, f, indent=4, default=str)

if __name__ == '__main__':
    main()
