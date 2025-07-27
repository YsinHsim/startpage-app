import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define a global default wallpaper URL
// Using a more reliable placeholder image URL
const DEFAULT_WALLPAPER_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2FEx9MlTC.jpg&f=1&nofb=1&ipt=f4d9482d805c68e2ad6aee789a25d2bac69f8436dfa3d24e40172069b464e657';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        searchEngines: {
          where: { userId: userId },
        },
        linkGroups: {
          include: {
            links: true,
          },
          where: { userId: userId },
        },
        wallpapers: {
          where: { userId: userId },
        },
      },
    });

    const defaultSearchEngines = await prisma.searchEngine.findMany({
      where: { isDefault: true, userId: null },
    });

    const combinedSearchEngines = [
      ...defaultSearchEngines,
      ...(user?.searchEngines || []),
    ];

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine the current wallpaper URL: use user's saved, or the default
    const currentWallpaper = user.currentWallpaperUrl || DEFAULT_WALLPAPER_URL;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        currentWallpaperUrl: currentWallpaper, // Use the determined wallpaper URL
        selectedSearchEngineId: user.selectedSearchEngineId,
      },
      searchEngines: combinedSearchEngines,
      linkGroups: user.linkGroups,
      wallpapers: user.wallpapers,
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action } = body;

    if (action === 'addWallpaper') {
      const { url, name } = body;
      if (!url) {
        return new NextResponse(JSON.stringify({ message: 'Wallpaper URL is required' }), { status: 400 });
      }

      const newWallpaper = await prisma.wallpaper.create({
        data: {
          userId: userId,
          url: url,
          name: name || 'Unnamed Wallpaper',
        },
      });

      // Also set it as the current wallpaper for the user
      await prisma.user.update({
        where: { id: userId },
        data: { currentWallpaperUrl: url },
      });

      return NextResponse.json({ message: 'Wallpaper added and set successfully', wallpaper: newWallpaper });

    } else if (action === 'setCurrentWallpaper') {
      const { wallpaperUrl } = body;
      if (!wallpaperUrl) {
        return new NextResponse(JSON.stringify({ message: 'Wallpaper URL is required' }), { status: 400 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { currentWallpaperUrl: wallpaperUrl },
      });

      return NextResponse.json({ message: 'Current wallpaper set successfully' });

    } else {
      return new NextResponse(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
    }

  } catch (error) {
    console.error('Error processing wallpaper action:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
