import { supabase } from 'lib/supabase';

const BUCKET = 'movie-posters';

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function getPosterFileExtension(file) {
  const fromName = file?.name?.split('.')?.pop()?.toLowerCase();
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }
  return MIME_TO_EXT[file?.type] || 'jpg';
}

export async function uploadMoviePoster(entryId, file) {
  const ext = getPosterFileExtension(file);
  const path = `${entryId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
}
