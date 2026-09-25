//
//  PositionsSelectionView.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

struct PositionsSelectionView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    @State private var selectedPositions: Set<String> = []
    
    let availablePositions = [
        "Top",
        "Bottom",
        "Versatile",
        "Switch",
        "Dominant",
        "Submissive",
        "Not Applicable"
    ]
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 30) {
                // Header
                VStack(spacing: 12) {
                    Text("Select Your Positions")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Choose the positions that are correct for you")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 40)
                
                // Positions Selection
                VStack(spacing: 16) {
                    Text("You can select multiple options")
                        .font(.headline)
                        .padding(.bottom, 8)
                    
                    ForEach(availablePositions, id: \.self) { position in
                        Button(action: {
                            if selectedPositions.contains(position) {
                                selectedPositions.remove(position)
                            } else {
                                selectedPositions.insert(position)
                            }
                        }) {
                            HStack {
                                Text(position)
                                    .font(.body)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedPositions.contains(position) {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.blue)
                                } else {
                                    Image(systemName: "circle")
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(selectedPositions.contains(position) ? Color.blue.opacity(0.1) : Color.gray.opacity(0.1))
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(selectedPositions.contains(position) ? Color.blue : Color.clear, lineWidth: 2)
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Continue Button
                Button(action: {
                    onboardingManager.completePositions(positions: Array(selectedPositions))
                }) {
                    Text("Continue")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(selectedPositions.isEmpty ? Color.gray : Color.blue)
                        )
                }
                .disabled(selectedPositions.isEmpty)
                .padding(.horizontal)
                .padding(.bottom, 30)
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden(true) // Prevent going back - must complete flow
        }
    }
}

#Preview {
    PositionsSelectionView()
        .environmentObject(OnboardingManager())
}


