// main.cpp
#include <windows.h>
#include <gl/GL.h>
#include <gl/GLU.h>
#include <chrono>

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

HDC   hDC;
HGLRC hRC;
HWND  hwnd;
int   width = 800, height = 600;

// Configura pixel format para OpenGL
void SetupPixelFormat(HDC hdc) {
    PIXELFORMATDESCRIPTOR pfd = {
        sizeof(pfd), 1,
        PFD_DRAW_TO_WINDOW|PFD_SUPPORT_OPENGL|PFD_DOUBLEBUFFER,
        PFD_TYPE_RGBA, 32,0,0,0,0,0,0,0,0,0,0,
        24,8,0, PFD_MAIN_PLANE,0,0,0,0
    };
    int pf = ChoosePixelFormat(hdc, &pfd);
    SetPixelFormat(hdc, pf, &pfd);
}

void InitGL() {
    glEnable(GL_DEPTH_TEST);
    glShadeModel(GL_SMOOTH);
}

void ResizeGL(int w, int h) {
    if (h==0) h=1;
    glViewport(0,0,w,h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0, (double)w/h, 1.0, 100.0);
    glMatrixMode(GL_MODELVIEW);
}

void DrawScene() {
    static auto t0 = std::chrono::steady_clock::now();
    auto now = std::chrono::steady_clock::now();
    float t = std::chrono::duration<float>(now-t0).count();

    glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0,0,30,  0,0,0,  0,1,0);

    // Sol
    GLUquadric* q = gluNewQuadric();
    glColor3f(1,1,0);
    gluSphere(q, 3.0, 20,20);

    // Terra orbitando
    glPushMatrix();
      glRotatef(t*50, 0,1,0);
      glTranslatef(10,0,0);
      glColor3f(0,0,1);
      gluSphere(q, 1.0, 16,16);
    glPopMatrix();

    SwapBuffers(hDC);
}

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE, LPSTR, int) {
    WNDCLASS wc = {
      CS_OWNDC, WndProc, 0,0, hInst,
      LoadIcon(NULL,IDI_APPLICATION),
      LoadCursor(NULL,IDC_ARROW),
      (HBRUSH)GetStockObject(BLACK_BRUSH),
      NULL, "GLWin"
    };
    RegisterClass(&wc);
    hwnd = CreateWindow("GLWin","Solar System",
        WS_OVERLAPPEDWINDOW|WS_VISIBLE,
        0,0,width,height,NULL,NULL,hInst,NULL);

    hDC = GetDC(hwnd);
    SetupPixelFormat(hDC);
    hRC = wglCreateContext(hDC);
    wglMakeCurrent(hDC,hRC);

    InitGL();
    ResizeGL(width,height);

    MSG msg;
    while (true) {
      if (PeekMessage(&msg,0,0,0,PM_REMOVE)) {
        if (msg.message==WM_QUIT) break;
        TranslateMessage(&msg);
        DispatchMessage(&msg);
      } else {
        DrawScene();
      }
    }

    wglMakeCurrent(NULL,NULL);
    wglDeleteContext(hRC);
    ReleaseDC(hwnd,hDC);
    return msg.wParam;
}

LRESULT CALLBACK WndProc(HWND w, UINT msg, WPARAM wp, LPARAM lp) {
    if (msg==WM_SIZE)
      ResizeGL(LOWORD(lp),HIWORD(lp));
    if (msg==WM_CLOSE)
      PostQuitMessage(0);
    return DefWindowProc(w,msg,wp,lp);
}
