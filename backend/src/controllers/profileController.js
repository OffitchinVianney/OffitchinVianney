import sanitizeHtml from 'sanitize-html';
import { supabaseAdmin } from '../config/supabase.js';

const sanitizeText = (input) => sanitizeHtml(input || '', { allowedTags: [], allowedAttributes: {} });

export async function me(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id,email,full_name,avatar_url,bio,created_at')
      .eq('id', req.user.sub)
      .single();

    if (error) throw error;
    return res.json({ user: data });
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = {
      full_name: req.body.fullName ? sanitizeText(req.body.fullName) : undefined,
      bio: req.body.bio ? sanitizeText(req.body.bio) : undefined
    };

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.user.sub)
      .select('id,email,full_name,avatar_url,bio')
      .single();

    if (error) throw error;
    return res.json({ user: data });
  } catch (err) {
    return next(err);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Missing image file' });

    const filePath = `avatars/${req.user.sub}-${Date.now()}.png`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('profile-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabaseAdmin.storage.from('profile-images').getPublicUrl(filePath);

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ avatar_url: publicData.publicUrl })
      .eq('id', req.user.sub)
      .select('id,email,full_name,avatar_url,bio')
      .single();

    if (error) throw error;
    return res.json({ user: data });
  } catch (err) {
    return next(err);
  }
}
