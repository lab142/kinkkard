//
//  MainAppView.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

struct MainAppView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    @EnvironmentObject var guestViewModel: GuestProfileViewModel
    @State private var showMatchResults = false  // ✅ Navigation state
    
    var body: some View {
        TabView {
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
            
            QRCodeView()
                .tabItem {
                    Label("QR Code", systemImage: "qrcode")
                }
            
            ScannerView(showMatchResults: $showMatchResults)
                .tabItem {
                    Label("Scanner", systemImage: "camera.fill")
                }
        }
        .sheet(isPresented: $showMatchResults) {
            MatchResultsView()
                .environmentObject(onboardingManager)
                .environmentObject(guestViewModel)
        }
    }
}

struct ProfileView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    
    var body: some View {
        NavigationStack {
            List {
                Section("Your Profile") {
                    if let orientation = onboardingManager.userProfile.orientation {
                        HStack {
                            Text("Orientation")
                            Spacer()
                            Text(orientation)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    if !onboardingManager.userProfile.positions.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Positions")
                            ForEach(onboardingManager.userProfile.positions, id: \.self) { position in
                                Text("• \(position)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    
                    if !onboardingManager.userProfile.kinks.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Kinks & Interests")
                            ForEach(onboardingManager.userProfile.kinks, id: \.self) { kink in
                                Text("• \(kink)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
                
                Section {
                    Button("Reset Onboarding") {
                        onboardingManager.resetOnboarding()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Profile")
        }
    }
}

struct QRCodeView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("QR Code View")
                    .font(.title)
                Text("Your QR code will appear here")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("My QR Code")
        }
    }
}

struct ScannerView: View {
    @EnvironmentObject var guestViewModel: GuestProfileViewModel
    @Binding var showMatchResults: Bool
    @State private var isScanning = false
    @State private var scannedCode: String = ""
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 30) {
                if isScanning {
                    Text("Scanning...")
                        .font(.title2)
                        .foregroundColor(.secondary)
                    
                    // Placeholder for actual QR scanner - you'll need to add CodeScanner package
                    Button("Simulate Scan (For Testing)") {
                        // Simulate scanning a QR code
                        let testQRData = """
                        {
                            "name": "Test Guest",
                            "favoritePositions": ["Mission", "Cow"],
                            "intoKinks": ["Bondage", "Role Play"],
                            "wouldTryKinks": ["BDSM", "Toys", "Anal Play"]
                        }
                        """
                        guestViewModel.importQRData(testQRData)
                        showMatchResults = true
                        isScanning = false
                    }
                    .buttonStyle(.borderedProminent)
                } else {
                    VStack(spacing: 20) {
                        Image(systemName: "qrcode.viewfinder")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        Text("Scan QR Code")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Text("Scan another person's QR code to compare kinks and find matches")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        
                        Button(action: {
                            isScanning = true
                            // TODO: Add actual QR scanner here using CodeScanner package
                            // For now, simulate after 1 second
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                let testQRData = """
                                {
                                    "name": "Test Guest",
                                    "favoritePositions": ["Mission", "Cow"],
                                    "intoKinks": ["Bondage", "Role Play"],
                                    "wouldTryKinks": ["BDSM", "Toys", "Anal Play"]
                                }
                                """
                                guestViewModel.importQRData(testQRData)
                                showMatchResults = true
                                isScanning = false
                            }
                        }) {
                            Text("Start Scanning")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Color.blue)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal, 40)
                    }
                }
                
                if !guestViewModel.guestName.isEmpty {
                    VStack(spacing: 10) {
                        Text("Last Scanned:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(guestViewModel.guestName)
                            .font(.headline)
                        
                        Button("View Matches") {
                            showMatchResults = true
                        }
                        .buttonStyle(.borderedProminent)
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.horizontal)
                }
            }
            .padding()
            .navigationTitle("Scanner")
        }
    }
}

#Preview {
    MainAppView()
        .environmentObject(OnboardingManager())
        .environmentObject(GuestProfileViewModel())
}


